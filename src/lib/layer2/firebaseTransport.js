/**
 * LAYER 2 — Network / Communication Layer
 * ----------------------------------------
 * firebaseTransport.js
 *
 * Wraps Firebase Realtime Database (WebSocket) connections into the Layer 2
 * transport contract.  Firebase RTDB uses a persistent WebSocket connection
 * under the hood, giving us sub-second push updates directly from the cloud
 * without any polling.
 *
 * Transport contract exposes:
 *   subscribe(farmId, onPacket, onStatusChange) → unsubscribe fn
 *   fetchOnce(farmId)                           → Promise<FarmoraPacket>
 *   getProtocol()                               → 'WebSocket'
 */

import { ref, onValue, get } from 'firebase/database';
import { db } from '../../firebase';
import { createPacket } from './dataPacket';

export const PROTOCOL = 'WebSocket';
export const SOURCE   = 'firebase';

/**
 * Subscribe to real-time latest farm data via Firebase RTDB WebSocket.
 *
 * @param {string}   farmId         - Farm document path key (e.g. 'thabo-farm')
 * @param {Function} onPacket       - Called with a FarmoraPacket on every update
 * @param {Function} onStatusChange - Called with 'connecting' | 'connected' | 'error' | 'disconnected'
 * @returns {Function}              - Call to unsubscribe / detach listener
 */
export function subscribe(farmId, onPacket, onStatusChange) {
  onStatusChange?.('connecting');

  const latestRef = ref(db, `farms/${farmId}/latest`);
  let requestedAt = Date.now();

  const unsub = onValue(
    latestRef,
    (snapshot) => {
      const latencyMs = Date.now() - requestedAt;
      requestedAt = Date.now(); // reset for next update

      onStatusChange?.('connected');

      const raw = snapshot.exists() ? snapshot.val() : null;
      const packet = createPacket({
        source:    SOURCE,
        protocol:  PROTOCOL,
        farmId,
        raw,
        latencyMs,
      });
      onPacket?.(packet);
    },
    (error) => {
      console.error('[FirebaseTransport] onValue error:', error);
      onStatusChange?.('error');
    },
  );

  return () => {
    unsub();
    onStatusChange?.('disconnected');
  };
}

/**
 * One-shot fetch of the latest farm data (no persistent listener).
 * Useful for initial page load before the WebSocket listener fires.
 *
 * @param {string} farmId
 * @returns {Promise<FarmoraPacket>}
 */
export async function fetchOnce(farmId) {
  const t0 = Date.now();
  const latestRef = ref(db, `farms/${farmId}/latest`);
  const snapshot = await get(latestRef);
  const latencyMs = Date.now() - t0;

  const raw = snapshot.exists() ? snapshot.val() : null;
  return createPacket({ source: SOURCE, protocol: PROTOCOL, farmId, raw, latencyMs });
}

/**
 * Subscribe to the rolling history feed (last N records).
 * Returns a normalized array of packets ordered oldest → newest.
 *
 * @param {string}   farmId
 * @param {Function} onHistory - Called with FarmoraPacket[]
 * @returns {Function} unsubscribe
 */
export function subscribeHistory(farmId, onHistory) {
  const historyRef = ref(db, `farms/${farmId}/history`);

  const unsub = onValue(historyRef, (snapshot) => {
    if (!snapshot.exists()) {
      onHistory([]);
      return;
    }

    const entries = Object.entries(snapshot.val())
      .map(([id, item]) => ({
        ...item,
        _firebaseKey: id,
      }))
      .sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0));

    const packets = entries.map((raw) =>
      createPacket({ source: SOURCE, protocol: PROTOCOL, farmId, raw }),
    );

    onHistory(packets);
  });

  return unsub;
}

/** Returns the wire protocol identifier used by this transport. */
export function getProtocol() {
  return PROTOCOL;
}
