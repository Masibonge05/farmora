// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

const debounce = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

async function fetchSuggestions(query, sessionToken) {
  const res = await fetch(
    `/api/places/autocomplete?input=${encodeURIComponent(query)}&sessionToken=${sessionToken}`,
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function fetchDetails(placeId) {
  const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(placeId)}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

function generateSessionToken() {
  return Math.random().toString(36).slice(2);
}

export function LocationStep({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const sessionToken = useMemo(() => generateSessionToken(), []);

  const debounced = useMemo(
    () =>
      debounce(async (text) => {
        if (!text.trim()) {
          setSuggestions([]);
          return;
        }
        setLoading(true);
        const data = await fetchSuggestions(text, sessionToken);
        setSuggestions(data);
        setLoading(false);
      }, 350),
    [sessionToken],
  );

  useEffect(() => {
    debounced(query);
  }, [query, debounced]);

  const handleSelect = async (item) => {
    setLoading(true);
    const details = await fetchDetails(item.placeId);
    setLoading(false);
    if (details) {
      const payload = {
        label: details.formattedAddress || item.description,
        location: details.location,
        placeId: details.placeId,
      };
      onSelect(payload);
      setSelected(payload);
      setQuery(details.formattedAddress || item.description);
      setSuggestions([]);
      setStatus('');
    }
  };

  const handleUseCurrent = () => {
    if (!navigator?.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocating(false);
        const payload = {
          label: 'Current location',
          location: coords,
          placeId: 'current-location',
        };
        onSelect(payload);
        setSelected(payload);
        setQuery(payload.label);
        setStatus('Using your current location');
        setSuggestions([]);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter farm address"
            className="auth-input"
            style={{ width: '100%', paddingLeft: 42, borderRadius: 14 }}
          />
          <MapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8a9e8a' }} />
          {loading && <Loader2 className="animate-float" size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8a9e8a' }} />}
        </div>
        {suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: 'rgba(10,18,10,0.96)',
              border: '1px solid rgba(154,203,143,0.2)',
              borderRadius: 12,
              padding: 6,
              zIndex: 20,
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {suggestions.map((s) => (
              <div
                key={s.placeId}
                onClick={() => handleSelect(s)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  color: '#f0f4f0',
                }}
              >
                {s.description}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUseCurrent}
        className="nav-item"
        style={{
          justifyContent: 'flex-start',
          gap: 12,
          borderLeft: 'none',
          border: '1px solid rgba(154,203,143,0.2)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        {locating ? <Loader2 size={16} className="animate-float" /> : <Navigation size={16} />}
        Use current location
      </button>

      {status && (
        <div style={{ fontSize: 12, color: '#8a9e8a' }}>{status}</div>
      )}

      {selected?.location ? (
        <div
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(154,203,143,0.2)',
            height: 200,
          }}
        >
          <iframe
            title="map-preview"
            width="100%"
            height="200"
            style={{ border: 'none' }}
            src={`https://www.google.com/maps?q=${selected.location.lat},${selected.location.lng}&z=14&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
    </div>
  );
}
