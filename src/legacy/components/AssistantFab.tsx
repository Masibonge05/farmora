// @ts-nocheck
'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useDashboardData } from '../data/dashboard-provider';

export function AssistantFab() {
  const { data } = useDashboardData();
  const [open, setOpen] = useState(false);

  const latestAlert = Array.isArray(data?.alerts) && data.alerts.length > 0 ? data.alerts[0] : null;
  const tip = latestAlert
    ? latestAlert.message
    : 'Ask about irrigation timing, disease risk, or market windows.';

  return (
    <>
      <button
        aria-label="Open Farmora assistant"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 22,
          bottom: 22,
          zIndex: 1200,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
          color: '#f0f4f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
        }}
      >
        <MessageCircle size={22} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: 0,
            width: '360px',
            maxWidth: '100vw',
            background: 'linear-gradient(180deg, rgba(12,24,12,0.96), rgba(8,18,8,0.98))',
            borderLeft: '1px solid rgba(74,158,74,0.2)',
            boxShadow: '0 0 48px rgba(0,0,0,0.45)',
            zIndex: 1300,
            padding: '18px 18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a9e4a', marginBottom: 4 }}>Assistant</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#f0f4f0' }}>Farmora Advisor</div>
            </div>
            <button
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#8a9e8a', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ fontSize: 13, color: '#a8b4a8', lineHeight: 1.5, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,158,74,0.18)' }}>
            {tip}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              'When should I water next?',
              'Any disease risk this week?',
              'Is it safe to spray tomorrow?',
              'What’s the best harvest window?',
            ].map((q) => (
              <button
                key={q}
                style={{
                  border: '1px solid rgba(74,158,74,0.3)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f0f4f0',
                  borderRadius: 999,
                  padding: '8px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <textarea
              rows={3}
              placeholder="Ask in your language…"
              style={{
                width: '100%',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(74,158,74,0.25)',
                color: '#f0f4f0',
                padding: '12px',
                fontFamily: 'Poppins, sans-serif',
                resize: 'none',
              }}
            />
            <button
              style={{
                marginTop: 10,
                width: '100%',
                borderRadius: 12,
                border: 'none',
                height: 44,
                background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
                color: '#0b150b',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              disabled
            >
              Send (coming soon)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
