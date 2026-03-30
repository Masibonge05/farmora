// @ts-nocheck
'use client';

import { weatherData as fallbackWeather } from '../data/dummyData';
import { useDashboardData } from '../data/dashboard-provider';
import {
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  MapPin,
  Sun,
  Sunrise,
  Thermometer,
  Wind,
} from 'lucide-react';

const hourlyForecast = [
  { time: '06:00', temp: 17, Icon: CloudSun, rain: 5 },
  { time: '08:00', temp: 19, Icon: CloudSun, rain: 5 },
  { time: '10:00', temp: 22, Icon: Sun, rain: 0 },
  { time: '12:00', temp: 24, Icon: Sun, rain: 0 },
  { time: '14:00', temp: 26, Icon: Sun, rain: 0 },
  { time: '16:00', temp: 25, Icon: CloudSun, rain: 10 },
  { time: '18:00', temp: 22, Icon: CloudSun, rain: 15 },
  { time: '20:00', temp: 19, Icon: CloudMoon, rain: 5 },
];

const extendedForecast = [
  { day: 'Monday', date: '31 Mar', high: 26, low: 14, rain: 10, Icon: CloudSun, condition: 'Mostly Sunny', humidity: 52, wind: 10 },
  { day: 'Tuesday', date: '1 Apr', high: 24, low: 13, rain: 25, Icon: CloudSun, condition: 'Partly Cloudy', humidity: 60, wind: 14 },
  { day: 'Wednesday', date: '2 Apr', high: 21, low: 12, rain: 70, Icon: CloudRain, condition: 'Rain Expected', humidity: 78, wind: 18 },
  { day: 'Thursday', date: '3 Apr', high: 18, low: 10, rain: 85, Icon: CloudLightning, condition: 'Heavy Rain', humidity: 88, wind: 22 },
  { day: 'Friday', date: '4 Apr', high: 23, low: 13, rain: 15, Icon: CloudSun, condition: 'Clearing', humidity: 55, wind: 12 },
];

const irrigationAdvisory = [
  { field: 'Field A', crop: 'Maize', today: 'Run', note: 'Normal schedule. Rain Wed may offset future needs.', status: 'ok' },
  { field: 'Field B', crop: 'Tomatoes', today: 'Run - Urgent', note: 'Moisture at 42%. Do not wait for Wednesday rain.', status: 'warn' },
  { field: 'Field C', crop: 'Spinach', today: 'Skip', note: 'Moisture at 74%. Wednesday rain will be sufficient.', status: 'ok' },
  { field: 'Field D', crop: 'Sorghum', today: 'Run - Critical', note: 'Moisture at 28%. Run immediately - 4hrs at 6L/hr.', status: 'alert' },
];

const statusColors = { ok: '#7ec87e', warn: '#e8a020', alert: '#c85820' };

export default function Weather() {
  const { data } = useDashboardData();
  const weatherData = data?.weatherData || fallbackWeather;
  const { current } = weatherData;
  const hourly = weatherData.hourly || hourlyForecast;
  const extended = weatherData.extended || weatherData.forecast || extendedForecast;
  const maxTemp = Math.max(...extended.map((d) => d.high));

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
          Weather Intelligence
        </h1>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          Limpopo, South Africa · Live forecast · AI-adjusted irrigation planning
        </div>
      </div>

      <div style={{
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(30,58,30,0.9) 0%, rgba(20,40,60,0.85) 100%)',
        border: '1px solid rgba(74,158,74,0.2)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 32,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'rgba(128,192,240,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(74,158,74,0.05)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 12 }}>
            <CloudSun size={62} color="#f0f4f0" strokeWidth={1.8} />
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '3rem', color: '#f0f4f0', lineHeight: 1 }}>
                {current.temp}°<span style={{ fontSize: '1.5rem', color: '#8a9e8a', fontWeight: 400 }}>C</span>
              </div>
              <div style={{ fontSize: 15, color: '#8a9e8a', marginTop: 4 }}>{current.condition}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#4a9e4a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} />
            <span>Limpopo, South Africa · Monday 30 March 2026</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minWidth: 280 }}>
          {[
            { Icon: Droplets, label: 'Humidity', val: `${current.humidity}%` },
            { Icon: Wind, label: 'Wind Speed', val: `${current.wind} km/h` },
            { Icon: Sun, label: 'UV Index', val: '4 - Moderate' },
            { Icon: Thermometer, label: 'Feels Like', val: `${current.temp + 2}°C` },
            { Icon: Eye, label: 'Visibility', val: '10+ km' },
            { Icon: Sunrise, label: 'Sunrise', val: '05:47' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                padding: '12px 14px',
                border: '1px solid rgba(74,158,74,0.1)',
              }}
            >
              <item.Icon size={16} style={{ marginBottom: 4 }} />
              <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f4f0' }}>{item.val}</div>
              <div style={{ fontSize: 10, color: '#8a9e8a', marginTop: 1 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>Today - Hourly</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {hourly.map((h, i) => {
            const Icon = h.Icon;

            return (
              <div key={h.time} style={{
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: 12,
                background: i === 3 ? 'rgba(74,158,74,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 3 ? 'rgba(74,158,74,0.3)' : 'transparent'}`,
              }}>
                <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 6 }}>{h.time}</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <Icon size={18} />
                </div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f4f0' }}>{h.temp}°</div>
                {h.rain > 0 && (
                  <div style={{ fontSize: 10, color: '#80c0f0', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Droplets size={10} />
                    <span>{h.rain}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 20 }}>5-Day Forecast</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {extended.map((day, i) => {
              const rainColor = day.rain > 60 ? '#c85820' : day.rain > 30 ? '#e8a020' : '#80c0f0';
              const Icon = day.Icon;

              return (
                <div key={day.day} style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 30px 1fr 60px 50px',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid rgba(74,158,74,0.08)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0' }}>{day.day}</div>
                    <div style={{ fontSize: 10, color: '#8a9e8a' }}>{day.date}</div>
                  </div>
                  <div><Icon size={18} /></div>
                  <div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(day.high / maxTemp) * 100}%`, height: '100%', background: 'linear-gradient(90deg, rgba(126,200,126,0.4), #7ec87e)', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#8a9e8a', marginTop: 3 }}>{day.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: '#f0f4f0' }}>{day.high}°</span>
                    <span style={{ color: '#4a6e4a' }}> / {day.low}°</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: rainColor, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Droplets size={11} />
                      <span>{day.rain}%</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>AI Irrigation Advisory</div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>Based on forecast + current soil moisture</div>
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(58,140,200,0.1)', border: '1px solid rgba(58,140,200,0.3)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <CloudRain size={20} color="#80c0f0" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#80c0f0' }}>Heavy rain forecast Wed-Thu (70-85%)</div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>Adjust irrigation schedules for all fields</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {irrigationAdvisory.map((field) => {
              const col = statusColors[field.status];

              return (
                <div key={field.field} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: `${col}08`, border: `1px solid ${col}25`,
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0', marginBottom: 2 }}>{field.field} - {field.crop}</div>
                    <div style={{ fontSize: 11, color: '#8a9e8a', lineHeight: 1.4 }}>{field.note}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                    background: `${col}20`, color: col, whiteSpace: 'nowrap', border: `1px solid ${col}40`,
                  }}>{field.today}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
