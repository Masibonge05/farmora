/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * networkSlice.js
 *
 * Redux Toolkit slice that holds the entire Layer 2 network state.
 * Components can subscribe to any part of this slice to reactively display
 * connection health, per-transport metrics, and packet statistics.
 *
 * Kept out of redux-persist whitelist intentionally — connection state is
 * ephemeral and should be fresh on every page load.
 */

import { createSlice } from '@reduxjs/toolkit';

const TRANSPORT_INITIAL = {
  status:       'idle',   // 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'disconnected' | 'closed'
  latencyMs:    null,
  lastEventAt:  null,
  messageCount: 0,
  errorCount:   0,
};

const initialState = {
  // Which transport is currently serving live data
  activeTransport: 'idle',   // 'firebase' | 'sse' | 'rest' | 'idle'

  // Overall system health derived from all transports
  networkHealth: 'offline',  // 'healthy' | 'degraded' | 'offline'

  // Per-transport metrics
  transports: {
    firebase: { ...TRANSPORT_INITIAL, protocol: 'WebSocket' },
    sse:      { ...TRANSPORT_INITIAL, protocol: 'SSE' },
    rest:     { ...TRANSPORT_INITIAL, protocol: 'HTTP/REST' },
  },

  // Rolling log of the last N packet summaries (no raw payload stored)
  recentPackets: [],          // max 50 entries
  totalPackets:  0,

  // Layer 2 session start time (set on first connected event)
  sessionStartedAt: null,
};

const MAX_RECENT_PACKETS = 50;

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    /**
     * Update the status of a single transport.
     * Triggered by the individual transport modules.
     */
    setTransportStatus(state, action) {
      const { transport, status } = action.payload;
      if (!state.transports[transport]) return;
      state.transports[transport].status = status;

      if (status === 'connected' && state.sessionStartedAt === null) {
        state.sessionStartedAt = Date.now();
      }

      if (status === 'error') {
        state.transports[transport].errorCount += 1;
      }
    },

    /**
     * Update latency for a transport after a round-trip measurement.
     */
    setTransportLatency(state, action) {
      const { transport, latencyMs } = action.payload;
      if (!state.transports[transport]) return;
      state.transports[transport].latencyMs = latencyMs;
    },

    /** Which transport is currently the primary data source. */
    setActiveTransport(state, action) {
      state.activeTransport = action.payload;
    },

    /** Derived health rolled up from all transport statuses. */
    setNetworkHealth(state, action) {
      state.networkHealth = action.payload;
    },

    /**
     * Record a received packet (metadata only — no raw payload).
     * Appended to the rolling log and increments total count.
     */
    recordPacket(state, action) {
      const { transport, packet } = action.payload;

      if (state.transports[transport]) {
        state.transports[transport].messageCount += 1;
        state.transports[transport].lastEventAt  = packet.receivedAt;
        if (packet.latencyMs !== null) {
          state.transports[transport].latencyMs = packet.latencyMs;
        }
      }

      state.totalPackets += 1;

      state.recentPackets = [
        packet,
        ...state.recentPackets,
      ].slice(0, MAX_RECENT_PACKETS);
    },

    /** Reset all network state (e.g. on sign-out or manual refresh). */
    resetNetwork() {
      return { ...initialState };
    },
  },
});

export const {
  setTransportStatus,
  setTransportLatency,
  setActiveTransport,
  setNetworkHealth,
  recordPacket,
  resetNetwork,
} = networkSlice.actions;

export default networkSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectNetworkHealth   = (state) => state.network?.networkHealth  ?? 'offline';
export const selectActiveTransport = (state) => state.network?.activeTransport ?? 'idle';
export const selectTransports      = (state) => state.network?.transports      ?? {};
export const selectRecentPackets   = (state) => state.network?.recentPackets   ?? [];
export const selectTotalPackets    = (state) => state.network?.totalPackets     ?? 0;
export const selectSessionStart    = (state) => state.network?.sessionStartedAt ?? null;
