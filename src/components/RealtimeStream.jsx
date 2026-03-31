import React from 'react'
import useRealtimeFarmFeed from '../lib/useRealtimeFarmFeed'

export default function RealtimeStream({ path = '/farms/thabo-farm/latest', data: externalData, status: externalStatus }) {
  const { data: internalData, status: internalStatus } = useRealtimeFarmFeed(path)
  const hasExternalState = externalStatus != null || externalData != null
  const data = hasExternalState ? externalData : internalData
  const status = hasExternalState ? externalStatus : internalStatus

  return (
    <div className="realtime-stream">
      <div style={{ marginBottom: 8 }}><strong>Realtime path:</strong> {path} — <em>{status}</em></div>
      {data == null ? (
        <div>No data yet</div>
      ) : (
        <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f7f7f7', padding: 12 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}
