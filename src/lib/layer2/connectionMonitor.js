/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * connectionMonitor.js
 *
 * React hook that aggregates the health of every Layer 2 transport into a
 * single, unified network-health state object.
 *
 * Metrics tracked per transport:
 *   status       - 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'disconnected' | 'closed'
 *   latencyMs    - Last measured round-trip latency
 *   lastEventAt  - Unix ms timestamp of the last received packet
 *   messageCount - Total packets received since mount
 *   upSince      - Unix ms when the transport first became 'connected'
 *   errorCount   - Cumulative errors
 *
 * Overall `networkHealth`:
 *   'healthy'  - At least one transport is connected
 *   'degraded' - Some transports are in error / reconnecting state
 *   'offline'  - No transports are connected
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

const INITIAL_TRANSPORT_STATE = {
  status:       'idle',
  latencyMs:    null,
  lastEventAt:  null,
  messageCount: 0,
  upSince:      null,
  errorCount:   0,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @returns {{
 *   transports: { firebase: object, sse: object, rest: object },
 *   networkHealth: 'healthy' | 'degraded' | 'offline',
 *   totalMessages: number,
 *   uptimeMs: number,
 *   updateTransport: (name: string, patch: object) => void,
 *   recordMessage:   (name: string, latencyMs?: number) => void,
 *   recordError:     (name: string) => void,
 * }}
 */
export default function useConnectionMonitor() {
  const [transports, setTransports] = useState({
    firebase: { ...INITIAL_TRANSPORT_STATE },
    sse:      { ...INITIAL_TRANSPORT_STATE },
    rest:     { ...INITIAL_TRANSPORT_STATE },
  });

  const [monitorStartedAt] = useState(() => Date.now());
  const [tick, setTick] = useState(0);

  // Refresh uptime counter every 5 s without causing heavy re-renders
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5_000);
    return () => clearInterval(id);
  }, []);

  // ── Mutation helpers ───────────────────────────────────────────────────────

  const updateTransport = useCallback((name, patch) => {
    setTransports((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev[name], ...patch };

      // Track upSince automatically when first connected
      if (patch.status === 'connected' && !prev[name].upSince) {
        updated.upSince = Date.now();
      }
      // Clear upSince on disconnect
      if (patch.status === 'disconnected' || patch.status === 'error' || patch.status === 'closed') {
        updated.upSince = null;
      }

      return { ...prev, [name]: updated };
    });
  }, []);

  const recordMessage = useCallback((name, latencyMs = null) => {
    setTransports((prev) => {
      if (!prev[name]) return prev;
      return {
        ...prev,
        [name]: {
          ...prev[name],
          messageCount: prev[name].messageCount + 1,
          lastEventAt:  Date.now(),
          ...(latencyMs !== null ? { latencyMs } : {}),
        },
      };
    });
  }, []);

  const recordError = useCallback((name) => {
    setTransports((prev) => {
      if (!prev[name]) return prev;
      return {
        ...prev,
        [name]: {
          ...prev[name],
          errorCount: prev[name].errorCount + 1,
        },
      };
    });
  }, []);

  // ── Derived metrics ────────────────────────────────────────────────────────

  const totalMessages = Object.values(transports).reduce(
    (sum, t) => sum + t.messageCount,
    0,
  );

  const uptimeMs = Date.now() - monitorStartedAt;

  const networkHealth = deriveNetworkHealth(transports);

  return {
    transports,
    networkHealth,
    totalMessages,
    uptimeMs,
    updateTransport,
    recordMessage,
    recordError,
    // expose tick so callers can react to the 5-second uptime refresh
    _tick: tick,
  };
}

// ─── Internal ─────────────────────────────────────────────────────────────────

function deriveNetworkHealth(transports) {
  const statuses = Object.values(transports).map((t) => t.status);

  const connected    = statuses.filter((s) => s === 'connected').length;
  const inError      = statuses.filter((s) => s === 'error' || s === 'reconnecting').length;

  if (connected > 0 && inError === 0) return 'healthy';
  if (connected > 0 && inError > 0)  return 'degraded';
  if (inError > 0 && connected === 0) return 'degraded';
  return 'offline';
}
