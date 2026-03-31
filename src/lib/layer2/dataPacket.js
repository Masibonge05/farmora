/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * dataPacket.js
 *
 * Defines the canonical FarmoraPacket schema used by every transport in Layer 2.
 * Raw payloads arriving from Firebase RTDB, SSE, or REST are normalised into this
 * structure before being handed up to Layer 3 (data-processing / middleware).
 *
 * Protocol identifiers follow the OSI transport naming convention:
 *   WS   → WebSocket (Firebase Realtime Database)
 *   SSE  → Server-Sent Events (Vercel API gateway)
 *   HTTP → Plain HTTP REST request
 */

/** @typedef {'firebase' | 'sse' | 'rest' | 'weather'} PacketSource */
/** @typedef {'WebSocket' | 'SSE' | 'HTTP/REST'} PacketProtocol */
/** @typedef {'ok' | 'stale' | 'error'} PacketQuality */

/**
 * Build a stable, transport-agnostic packet from a raw payload.
 *
 * @param {object} opts
 * @param {PacketSource}   opts.source    - Which transport ingested this packet
 * @param {PacketProtocol} opts.protocol  - Wire protocol used
 * @param {string}         opts.farmId    - Logical farm identifier
 * @param {any}            opts.raw       - The unmodified raw payload
 * @param {number}         [opts.latencyMs] - Round-trip latency in ms (optional)
 * @returns {FarmoraPacket}
 */
export function createPacket({ source, protocol, farmId, raw, latencyMs = null }) {
  const now = Date.now();

  return {
    // ── Identity ───────────────────────────────────────────────
    packetId:   `${source}-${now}-${Math.random().toString(36).slice(2, 8)}`,
    source,
    protocol,
    farmId:     farmId ?? 'unknown',

    // ── Timing ─────────────────────────────────────────────────
    timestamp:  extractTimestamp(raw) ?? now,
    receivedAt: now,
    latencyMs,

    // ── Quality ─────────────────────────────────────────────────
    quality: deriveQuality(raw, latencyMs),

    // ── Normalised payload ──────────────────────────────────────
    payload: normalisePayload(raw, source),

    // ── Original data (for debugging / archive) ─────────────────
    raw,
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function extractTimestamp(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const candidates = [
    raw.timestamp, raw.updatedAt, raw.ts, raw.time,
    raw.latest?.timestamp, raw.sensors?.timestamp,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 1_000_000_000) return n;
  }
  return null;
}

function deriveQuality(raw, latencyMs) {
  if (!raw) return 'error';
  if (latencyMs !== null && latencyMs > 8_000) return 'stale';
  return 'ok';
}

/**
 * Flatten any raw shape into a predictable { soil, weather, sensors, alerts } object.
 * Additional unknown keys are preserved under `extra`.
 */
function normalisePayload(raw, source) {
  if (!raw || typeof raw !== 'object') return { soil: null, weather: null, sensors: [], alerts: [], extra: raw };

  // ── Soil ────────────────────────────────────────────────────
  const soilSrc = raw.soil ?? raw.soilData ?? raw.soilMetrics ?? null;
  const soil = soilSrc
    ? {
        moisture:    numOr(soilSrc.moisture ?? soilSrc.moisturePercent ?? soilSrc.soil_moisture),
        temperature: numOr(soilSrc.temperature ?? soilSrc.temp),
        pH:          numOr(soilSrc.pH ?? soilSrc.ph),
        ec:          numOr(soilSrc.ec ?? soilSrc.electricalConductivity),
        nitrogen:    numOr(soilSrc.nitrogen ?? soilSrc.n),
      }
    : null;

  // ── Weather ─────────────────────────────────────────────────
  const wxSrc = raw.weather ?? raw.weatherData ?? raw.current ?? null;
  const weather = wxSrc
    ? {
        temperature: numOr(wxSrc.temperature ?? wxSrc.temperature_2m ?? wxSrc.temp),
        humidity:    numOr(wxSrc.humidity ?? wxSrc.relative_humidity_2m),
        windSpeed:   numOr(wxSrc.windSpeed ?? wxSrc.wind_speed_10m ?? wxSrc.wind),
        precipitation: numOr(wxSrc.precipitation ?? wxSrc.rain),
        weatherCode: numOr(wxSrc.weatherCode ?? wxSrc.weather_code),
      }
    : null;

  // ── Sensors array ───────────────────────────────────────────
  const sensorsSrc = raw.sensors ?? raw.sensorNodes ?? raw.nodes ?? [];
  const sensors = Array.isArray(sensorsSrc)
    ? sensorsSrc.map((s) => ({
        id:       s.id ?? s.nodeId ?? 'unknown',
        field:    s.field ?? s.fieldId ?? null,
        battery:  numOr(s.battery ?? s.batteryLevel),
        signal:   s.signal ?? s.signalStrength ?? null,
        status:   s.status ?? 'unknown',
        lastPing: s.lastPing ?? s.lastSeen ?? null,
      }))
    : [];

  // ── Alerts array ────────────────────────────────────────────
  const alertsSrc = raw.alerts ?? raw.notifications ?? [];
  const alerts = Array.isArray(alertsSrc)
    ? alertsSrc.map((a) => ({
        id:      a.id ?? a.alertId ?? `alert-${Date.now()}`,
        type:    a.type ?? a.severity ?? 'info',
        field:   a.field ?? a.fieldId ?? null,
        message: a.message ?? a.msg ?? '',
        time:    a.time ?? a.timestamp ?? null,
      }))
    : [];

  // ── Extra keys not mapped above ──────────────────────────────
  const { soil: _s, soilData: _sd, weather: _w, weatherData: _wd, current: _c,
          sensors: _sn, sensorNodes: _nn, nodes: _nd, alerts: _a, notifications: _n,
          ...extra } = raw;

  return { soil, weather, sensors, alerts, extra };
}

function numOr(val, fallback = null) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}
