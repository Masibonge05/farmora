// @ts-nocheck
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultDashboardSnapshot } from './dummyData';

const DashboardDataContext = createContext({
  data: defaultDashboardSnapshot,
  isLoading: false,
  error: null,
});

function makeBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
}

async function fetchDashboardSnapshot() {
  const base = makeBaseUrl();
  const url = base ? `${base}/dashboard` : '/api/dashboard';
  const headers: Record<string, string> = {};
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { cache: 'no-store', headers });
  if (!res.ok) {
    throw new Error(`Dashboard fetch failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data || json;
}

export function DashboardDataProvider({ children }) {
  const [state, setState] = useState({
    data: defaultDashboardSnapshot,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    let eventSource: EventSource | null = null;

    (async () => {
      try {
        const remote = await fetchDashboardSnapshot();
        if (cancelled) return;
        setState({
          data: { ...defaultDashboardSnapshot, ...remote },
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, isLoading: false, error }));
        console.error('Dashboard fetch failed; using fallback data', error);
      }
    })();

    // Live stream via SSE
    try {
      const base = makeBaseUrl();
      const streamUrl = base ? `${base}/stream` : '/api/stream';
      eventSource = new EventSource(streamUrl);

      eventSource.addEventListener('soil.update', (event) => {
        const payload = JSON.parse(event.data);
        setState((prev) => {
          const next = { ...prev.data };
          if (next.cropHealth?.fields?.length) {
            next.cropHealth.fields = next.cropHealth.fields.map((f) =>
              String(f.id) === String(payload.fieldId) || f.name === payload.fieldId
                ? { ...f, moisture: payload.moisture ?? f.moisture }
                : f,
            );
          }
          return { ...prev, data: next };
        });
      });

      eventSource.addEventListener('alert.new', (event) => {
        const payload = JSON.parse(event.data);
        setState((prev) => {
          const next = { ...prev.data };
          const list = next.alerts?.items || next.alerts || [];
          const merged = [payload, ...list].slice(0, 20);
          if (next.alerts?.items) {
            next.alerts.items = merged;
          } else {
            next.alerts = merged as any;
          }
          return { ...prev, data: next };
        });
      });

      eventSource.addEventListener('weather.update', (event) => {
        const payload = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            weather: {
              ...prev.data.weather,
              current: { ...prev.data.weather?.current, temp: payload.temp },
            },
          },
        }));
      });

      eventSource.addEventListener('action.recommendation', (event) => {
        const payload = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            recommendations: [
              payload,
              ...(Array.isArray((prev.data as any).recommendations)
                ? (prev.data as any).recommendations
                : []),
            ],
          },
        }));
      });

      eventSource.onerror = (error) => {
        console.warn('SSE connection issue', error);
      };
    } catch (error) {
      console.warn('SSE not available', error);
    }

    return () => {
      cancelled = true;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
