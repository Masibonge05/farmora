import React, { useEffect, useState, useRef } from 'react'

export default function RealtimeStream({ path = '/farms/thabo-farm' }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle')
  const esRef = useRef(null)
  const BASE = import.meta.env.VITE_API_BASE || 'https://famora-server-api.vercel.app'

  useEffect(() => {
    let mounted = true
    const fetchInitial = async () => {
      setStatus('loading')
      try {
        const res = await fetch(`${BASE}/tools/fetch?path=${encodeURIComponent(path)}`)
        const json = await res.json()
        if (!mounted) return
        setData(json.data)
        setStatus('connected')
      } catch (err) {
        console.error('initial fetch failed', err)
        if (!mounted) return
        setStatus('error')
      }
    }

    fetchInitial()

    const es = new EventSource(`${BASE}/realtime/stream?path=${encodeURIComponent(path)}`)
    esRef.current = es
    es.onopen = () => setStatus('listening')
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)
        // server sends { path, data }
        if (mounted) setData(parsed.data)
      } catch (err) {
        console.warn('invalid SSE payload', err)
      }
    }
    es.onerror = (err) => {
      console.error('SSE error', err)
      setStatus('error')
      // try reconnect: EventSource auto-reconnect for network errors
    }

    return () => {
      mounted = false
      try { es.close() } catch (e) {}
    }
  }, [path])

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
