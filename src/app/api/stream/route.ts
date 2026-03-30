import { NextResponse } from 'next/server';

import { mockDashboardSnapshot } from '@/core/infrastructure/mock-dashboard-snapshot';

const encoder = new TextEncoder();

function toSseEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(toSseEvent(event, payload)));
      };

      // Initial snapshot
      send('snapshot', mockDashboardSnapshot);

      const interval = setInterval(() => {
        // Simulate soil moisture update on first field
        const field = mockDashboardSnapshot.cropHealth.fields[0];
        const delta = randomBetween(-2, 2);
        field.moisture = Math.max(20, Math.min(90, field.moisture + delta));

        send('soil.update', {
          fieldId: field.id,
          moisture: field.moisture,
          ts: new Date().toISOString(),
        });

        // Simulate an alert occasionally
        if (Math.random() > 0.7) {
          const alert = {
            id: `sim-${Date.now()}`,
            type: 'warning',
            field: field.name,
            message: `Soil moisture trending ${delta < 0 ? 'down' : 'up'} to ${field.moisture}%`,
            time: 'just now',
            icon: '💧',
          };
          mockDashboardSnapshot.alerts.items.unshift(alert as any);
          send('alert.new', alert);
        }
      }, 4000);

      const weatherInterval = setInterval(() => {
        const current = mockDashboardSnapshot.weather.current;
        current.temp = Math.max(15, Math.min(35, current.temp + randomBetween(-1, 1)));
        send('weather.update', { temp: current.temp, ts: new Date().toISOString() });
      }, 6000);

      const actionInterval = setInterval(() => {
        send('action.recommendation', {
          id: `act-${Date.now()}`,
          title: 'Water Field A',
          detail: 'Run drip for 2 hours at 6 L/hr',
          urgency: 'critical',
          ts: new Date().toISOString(),
        });
      }, 10000);

      controller.enqueue(encoder.encode(': connected\n\n'));

      return () => {
        clearInterval(interval);
        clearInterval(weatherInterval);
        clearInterval(actionInterval);
      };
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
