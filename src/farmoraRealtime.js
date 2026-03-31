import { db } from './firebase'
import { onValue, push, ref, set } from 'firebase/database'

const FARM_ID = 'thabo-farm'

// Main realtime subscription used by pages
export function subscribeToFarmData(callback, farmId = FARM_ID) {
  const latestRef = ref(db, `farms/${farmId}/latest`)
  return onValue(latestRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null)
  })
}

// Alias so old code still works
export function listenToLatestFarmData(callback, farmId = FARM_ID) {
  return subscribeToFarmData(callback, farmId)
}

// History subscription used by detail/chart pages
export function subscribeToHistory(callback, farmId = FARM_ID) {
  const historyRef = ref(db, `farms/${farmId}/history`)
  return onValue(historyRef, (snapshot) => {
    const value = snapshot.val()

    if (!value) {
      callback([])
      return
    }

    const items = Object.entries(value).map(([id, item]) => ({
      id,
      ...item,
    }))

    items.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0))
    callback(items)
  })
}

// Alias so old code still works
export function listenToFarmHistory(callback, farmId = FARM_ID) {
  return subscribeToHistory(callback, farmId)
}

// Optional write helpers
export async function writeLatestFarmData(payload, farmId = FARM_ID) {
  const latestRef = ref(db, `farms/${farmId}/latest`)
  await set(latestRef, payload)
}

export async function appendFarmHistory(payload, farmId = FARM_ID) {
  const historyRef = ref(db, `farms/${farmId}/history`)
  const newRef = push(historyRef)
  await set(newRef, payload)
}