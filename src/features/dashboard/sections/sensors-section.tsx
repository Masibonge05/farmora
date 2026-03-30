'use client';

import { Cpu, RadioTower, Waves } from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

interface SensorsSectionProps {
  snapshot: DashboardSnapshot;
}

export function SensorsSection({ snapshot }: SensorsSectionProps) {
  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Sensor fleet</span>
        <h1>IoT node health and network reliability</h1>
        <p>
          Keep the data plane healthy so agronomy decisions stay grounded in fresh, trustworthy
          telemetry.
        </p>
      </div>

      <div className="grid-cols-3">
        {snapshot.sensors.nodes.map((node) => (
          <SectionCard key={node.id} className="sensor-card">
            <div className="sensor-card__head">
              <div>
                <strong>{node.id}</strong>
                <p>{node.field}</p>
              </div>
              <StatusBadge
                label={node.status}
                tone={node.status === 'warning' ? 'warning' : node.status === 'offline' ? 'critical' : 'good'}
              />
            </div>
            <div className="sensor-card__grid sensor-card__grid--compact">
              <div>
                <Cpu size={15} />
                <strong>{node.battery}%</strong>
                <span>Battery</span>
              </div>
              <div>
                <RadioTower size={15} />
                <strong>{node.signal}</strong>
                <span>Signal</span>
              </div>
              <div>
                <Waves size={15} />
                <strong>{node.lastPing}</strong>
                <span>Last ping</span>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid-cols-2">
        <SectionCard
          title="Network health"
          description="Operational KPIs for the telemetry layer backing the dashboard."
        >
          <div className="list-stack">
            {snapshot.sensors.networkStats.map((stat) => (
              <article key={stat.label} className="data-row">
                <div>
                  <div className="data-row__title">{stat.label}</div>
                </div>
                <StatusBadge label={stat.value} tone={stat.good ? 'good' : 'warning'} />
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pair a new node"
          description="A placeholder operational form, ready to connect to a real backend command."
        >
          <form className="stack-form">
            <label className="field-label" htmlFor="node-id">
              Node ID
            </label>
            <input id="node-id" className="auth-input" placeholder="SN-08" />

            <label className="field-label" htmlFor="field-id">
              Assign to field
            </label>
            <input id="field-id" className="auth-input" placeholder="Field E" />

            <label className="field-label" htmlFor="gps">
              GPS coordinates
            </label>
            <input id="gps" className="auth-input" placeholder="-24.6543, 29.8821" />

            <button type="button" className="primary-button">
              Pair sensor
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
