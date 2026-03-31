/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * transportManager.js
 *
 * The central orchestration hook for all Layer 2 transports.
 *
 * Responsibilities:
 *   1. Opens Firebase RTDB (WebSocket) and SSE streams simultaneously
 *   2. Chooses the "primary" transport based on availability:
 *        SSE online ──▶ SSE is primary
 *        SSE offline ──▶ Firebase RTDB is primary (automatic failover)
 *   3. Exposes a single unified `data` / `latestPacket` to consumers
 *   4. Dispatches network state updates to Redux (networkSlice)
 *   5. Reports per-transport metrics via useConnectionMonitor
 *
 * Usage:
 *   const { latestPacket, data, health, transports } = useTransportManager({ farmId });
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as firebase from './firebaseTransport';
import * as sse      from './sseTransport';
import useConnectionMonitor from './connectionMonitor';
import {
  setTransportStatus,
  setActiveTransport,
  recordPacket,
  setNetworkHealth,
} from '../../store/networkSlice';

const SSE_PATH_PREFIX = '/farms/';

/**
 * @param {object} opts
 * @param {string} [opts.farmId='thabo-farm']   Farm to subscribe to
 * @param {boolean} [opts.enableFirebase=true]  Toggle Firebase transport
 * @param {boolean} [opts.enableSse=true]       Toggle SSE transport
 */
export default function useTransportManager({
  farmId       = 'thabo-farm',
  enableFirebase = true,
  enableSse      = true,
} = {}) {
  const dispatch = useDispatch();
  const monitor  = useConnectionMonitor();

  const [latestPacket, setLatestPacket] = useState(null);
  const [activeTransport, setActive]    = useState('idle'); // 'firebase' | 'sse' | 'idle'

  const fbStatusRef  = useRef('idle');
  const sseStatusRef = useRef('idle');

  // ── Packet handler shared by both transports ─────────────────────────────
  const handlePacket = useCallback((packet, transportName) => {
    // Only accept the packet if it came from the current primary transport,
    // or if the active transport is still idle (bootstrapping)
    const isSsePrimary = sseStatusRef.current === 'connected';
    const isMine =
      (isSsePrimary && transportName === 'sse') ||
      (!isSsePrimary && transportName === 'firebase');

    if (!isMine) return;

    setLatestPacket(packet);
    monitor.recordMessage(transportName, packet.latencyMs);
    dispatch(recordPacket({ transport: transportName, packet: serializePacket(packet) }));
  }, [dispatch, monitor]);

  // ── Firebase transport ───────────────────────────────────────────────────
  useEffect(() => {
    if (!enableFirebase) return;

    const unsub = firebase.subscribe(
      farmId,
      (packet) => handlePacket(packet, 'firebase'),
      (status) => {
        fbStatusRef.current = status;
        monitor.updateTransport('firebase', { status });
        dispatch(setTransportStatus({ transport: 'firebase', status }));
        updateActiveTransport(sseStatusRef.current, status);
      },
    );

    return unsub;
  }, [farmId, enableFirebase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── SSE transport ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enableSse) return;

    const path = `${SSE_PATH_PREFIX}${farmId}`;

    // Hydrate immediately with a REST fetch so the UI isn't blank
    sse.fetchOnce(path).then((packet) => {
      if (sseStatusRef.current !== 'connected') {
        setLatestPacket(packet);
        monitor.recordMessage('rest', packet.latencyMs);
      }
    }).catch(() => { /* firebase will cover */ });

    const unsub = sse.subscribe(
      path,
      (packet) => handlePacket(packet, 'sse'),
      (status) => {
        sseStatusRef.current = status;
        monitor.updateTransport('sse', { status });
        dispatch(setTransportStatus({ transport: 'sse', status }));
        updateActiveTransport(status, fbStatusRef.current);
      },
      {
        onStats: (stats) => {
          monitor.updateTransport('sse', {
            messageCount: stats.messageCount,
          });
        },
      },
    );

    return unsub;
  }, [farmId, enableSse]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync network health to Redux ─────────────────────────────────────────
  useEffect(() => {
    dispatch(setNetworkHealth(monitor.networkHealth));
  }, [monitor.networkHealth, dispatch]);

  // ── Active transport decision logic ─────────────────────────────────────
  function updateActiveTransport(sseStatus, fbStatus) {
    const primary = sseStatus === 'connected' ? 'sse' : fbStatus === 'connected' ? 'firebase' : 'idle';
    setActive(primary);
    dispatch(setActiveTransport(primary));
  }

  return {
    latestPacket,
    data:            latestPacket?.payload ?? null,
    health:          monitor.networkHealth,
    transports:      monitor.transports,
    totalMessages:   monitor.totalMessages,
    uptimeMs:        monitor.uptimeMs,
    activeTransport,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip non-serializable fields before storing a packet in Redux. */
function serializePacket(packet) {
  return {
    packetId:   packet.packetId,
    source:     packet.source,
    protocol:   packet.protocol,
    farmId:     packet.farmId,
    timestamp:  packet.timestamp,
    receivedAt: packet.receivedAt,
    latencyMs:  packet.latencyMs,
    quality:    packet.quality,
  };
}
