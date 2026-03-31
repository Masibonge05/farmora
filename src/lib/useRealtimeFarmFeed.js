import { useEffect, useRef, useState } from 'react';

export default function useRealtimeFarmFeed(path = '/farms/thabo-farm') {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const esRef = useRef(null);
  const base = import.meta.env.VITE_API_BASE || 'https://famora-server-api.vercel.app';

  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`${base}/tools/fetch?path=${encodeURIComponent(path)}`);
        const json = await res.json();
        if (!mounted) return;
        setData(json?.data ?? null);
        setStatus('connected');
      } catch (err) {
        console.error('initial fetch failed', err);
        if (!mounted) return;
        setStatus('error');
      }
    };

    fetchInitial();

    const es = new EventSource(`${base}/realtime/stream?path=${encodeURIComponent(path)}`);
    esRef.current = es;

    es.onopen = () => {
      setStatus('listening');
    };

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (mounted) {
          setData(parsed?.data ?? null);
        }
      } catch (err) {
        console.warn('invalid SSE payload', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error', err);
      setStatus('error');
    };

    return () => {
      mounted = false;
      try {
        es.close();
      } catch (e) {
        // no-op
      }
    };
  }, [base, path]);

  return { data, status, eventSource: esRef.current };
}
