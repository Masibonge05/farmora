'use client';

import { Droplets, Eye, MapPin, Sunrise, Sun, Thermometer, Wind } from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { WeatherIcon } from '@/features/dashboard/components/weather-icon';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

interface WeatherSectionProps {
  snapshot: DashboardSnapshot;
}

export function WeatherSection({ snapshot }: WeatherSectionProps) {
  const maxTemp = Math.max(...snapshot.weather.extended.map((day) => day.high));

  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Weather intelligence</span>
        <h1>Forecast-aware irrigation planning</h1>
        <p>
          Current conditions, hourly shifts, and multi-day rainfall risk blended into irrigation
          decisions per field.
        </p>
      </div>

      <section className="weather-hero">
        <div>
          <div className="weather-hero__temp">
            <WeatherIcon icon="cloud-sun" size={58} />
            <div>
              <strong>{snapshot.weather.current.temp}°C</strong>
              <p>{snapshot.weather.current.condition}</p>
            </div>
          </div>
          <div className="weather-hero__meta">
            <MapPin size={14} />
            <span>{snapshot.farm.location} · Monday 30 March 2026</span>
          </div>
        </div>

        <div className="weather-hero__stats">
          {[
            { label: 'Humidity', value: `${snapshot.weather.current.humidity}%`, icon: Droplets },
            { label: 'Wind', value: `${snapshot.weather.current.wind} km/h`, icon: Wind },
            { label: 'UV index', value: '4 · Moderate', icon: Sun },
            { label: 'Feels like', value: `${snapshot.weather.current.temp + 2}°C`, icon: Thermometer },
            { label: 'Visibility', value: '10+ km', icon: Eye },
            { label: 'Sunrise', value: '05:47', icon: Sunrise },
          ].map((item) => (
            <article key={item.label} className="weather-stat">
              <item.icon size={16} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <SectionCard title="Today by hour" description="A lightweight hourly view for planning the next field runs.">
        <div className="hourly-grid">
          {snapshot.weather.hourly.map((entry) => (
            <article key={entry.time} className="hourly-card">
              <span>{entry.time}</span>
              <WeatherIcon icon={entry.icon} size={18} />
              <strong>{entry.temp}°</strong>
              <small>{entry.rain}% rain</small>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid-cols-2">
        <SectionCard title="Five-day forecast" description="Temperature spread and rain risk over the next few days.">
          <div className="list-stack">
            {snapshot.weather.extended.map((day) => (
              <article key={day.day} className="forecast-row">
                <div className="forecast-row__lead">
                  <div>
                    <strong>{day.day}</strong>
                    <p>{day.date}</p>
                  </div>
                  <WeatherIcon icon={day.icon} size={18} />
                </div>

                <div className="forecast-row__bar">
                  <div style={{ width: `${(day.high / maxTemp) * 100}%` }} />
                </div>

                <div className="forecast-row__tail">
                  <span>
                    {day.high}° / {day.low}°
                  </span>
                  <StatusBadge
                    label={`${day.rain}% rain`}
                    tone={day.rain > 60 ? 'critical' : day.rain > 25 ? 'warning' : 'info'}
                  />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Irrigation advisory"
          description="Field-specific recommendations driven by both the forecast and current soil state."
        >
          <div className="list-stack">
            {snapshot.weather.irrigationAdvisory.map((item) => (
              <article key={item.field} className="advisory-card">
                <div className="advisory-card__header">
                  <div>
                    <strong>
                      {item.field} · {item.crop}
                    </strong>
                    <p>{item.note}</p>
                  </div>
                  <StatusBadge
                    label={item.today}
                    tone={item.status === 'alert' ? 'critical' : item.status === 'warn' ? 'warning' : 'good'}
                  />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
