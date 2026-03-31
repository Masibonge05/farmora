/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * sseTransport.js
 *
 * Implements the Server-Sent Events (SSE) transport.
 *
 * Data flow:
 *   ESP32 sensor → MQTT broker (edge) → Vercel API server
 *     → SSE stream (/realtime/stream) → this transport → FarmoraPacket
 *
 * SSE is a unidirectional, HTTP/1.1-based, text-streaming protocol.
 * It is ideal for real-time dashboard updates because:
 *   • Native browser support (EventSource API)
 *   • Automatic reconnection with configurable backoff
 *   • Works through most HTTP proxies and CDN edges
 *
 * Transport contract exposes:
 *   subscribe(path, onPacket, onStatusChange) → unsubscribe fn
 *   fetchOnce(path)                           → Promise<FarmoraPacket>
 *   getProtocol()                             → 'SSE'
 */

import { createPacket } from './dataPacket';

export const PROTOCOL      = 'SSE';
export const SOURCE        = 'sse';
const BASE_URL             = import.meta.env.VITE_API_BASE ?? 'https://famora-server-api.vercel.app';
const MAX_RECONNECT_DELAY  = 30_000; // ms
const BASE_RECONNECT_DELAY = 1_000;  // ms

/**
 * Open an SSE stream and emit normalised FarmoraPackets.
 *
 * Implements exponential back-off reconnection so that a temporary
 * server restart does not cascade into a broken UI.
 *
 * @param {string}   path           - Firebase-style path, e.g. '/farms/thabo-farm'
 * @param {Function} onPacket       - Called with FarmoraPacket on each SSE message
 * @param {Function} onStatusChange - Called with 'connecting'|'connected'|'reconnecting'|'error'|'closed'
 * @param {object}   [opts]
 * @param {Function} [opts.onStats] - Called with { messageCount, reconnectCount, lastEventAt }
 * @returns {Function}              - Cleanup / unsubscribe function
 */
export function subscribe(path, onPacket, onStatusChange, { onStats } = {}) {
  let es              = null;
  let destroyed       = false;
  let reconnectDelay  = BASE_RECONNECT_DELAY;
  let reconnectTimer  = null;
  let messageCount    = 0;
  let reconnectCount  = 0;
  let lastEventAt     = null;

  const farmId = extractFarmId(path);

  function open() {
    if (destroyed) return;

    onStatusChange?.('connecting');

    const url = `${BASE_URL}/realtime/stream?path=${encodeURIComponent(path)}`;
    es = new EventSource(url);

    es.onopen = () => {
      reconnectDelay = BASE_RECONNECT_DELAY; // reset back-off on successful connect
      onStatusChange?.('connected');
    };

    es.onmessage = (event) => {
      const sentAt = Date.now();
      let raw = null;

      try {
        const parsed = JSON.parse(event.data);
        raw = parsed?.data ?? parsed;
      } catch {
        console.warn('[SseTransport] Unparseable SSE payload:', event.data);
        return;
      }

      messageCount += 1;
      lastEventAt   = sentAt;

      const packet = createPacket({
        source:   SOURCE,
        protocol: PROTOCOL,
        farmId,
        raw,
        latencyMs: null, // SSE does not carry a server timestamp by default
      });

      onPacket?.(packet);
      onStats?.({ messageCount, reconnectCount, lastEventAt });
    };

    es.onerror = () => {
      es.close();
      es = null;

      if (destroyed) return;

      onStatusChange?.('reconnecting');
      reconnectCount += 1;
      onStats?.({ messageCount, reconnectCount, lastEventAt });

      reconnectTimer = setTimeout(() => {
        // Exponential back-off with jitter
        reconnectDelay = Math.min(reconnectDelay * 2 + jitter(), MAX_RECONNECT_DELAY);
        open();
      }, reconnectDelay);
    };
  }

  open();

  return function unsubscribe() {
    destroyed = true;
    clearTimeout(reconnectTimer);
    try { es?.close(); } catch { /* no-op */ }
    onStatusChange?.('closed');
  };
}

/**
 * One-shot REST fetch (HTTP GET) of current farm data from the API gateway.
 * Used as an immediate data hydration step before the SSE stream fires its
 * first event.
 *
 * @param {string} path - Firebase path, e.g. '/farms/thabo-farm'
 * @returns {Promise<FarmoraPacket>}
 */
export async function fetchOnce(path) {
  const t0  = Date.now();
  const url = `${BASE_URL}/tools/fetch?path=${encodeURIComponent(path)}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`[SseTransport] HTTP ${res.status} on ${url}`);

  const json      = await res.json();
  const latencyMs = Date.now() - t0;
  const raw       = json?.data ?? json;
  const farmId    = extractFarmId(path);

  return createPacket({ source: SOURCE, protocol: 'HTTP/REST', farmId, raw, latencyMs });
}

/** Returns the wire protocol identifier for SSE. */
export function getProtocol() {
  return PROTOCOL;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractFarmId(path) {
  // '/farms/thabo-farm'  →  'thabo-farm'
  // '/farms/thabo-farm/latest' → 'thabo-farm'
  const parts = path.replace(/^\//, '').split('/');
  return parts[1] ?? parts[0] ?? 'unknown';
}

function jitter() {
  return Math.floor(Math.random() * 500);
}
