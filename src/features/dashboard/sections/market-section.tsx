'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, BadgeCheck, ShoppingCart } from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { SectionCard } from '@/shared/ui/section-card';

interface MarketSectionProps {
  snapshot: DashboardSnapshot;
}

export function MarketSection({ snapshot }: MarketSectionProps) {
  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Market intelligence</span>
        <h1>Pricing, buyer access, and trade timing</h1>
        <p>
          Commodity movement and buyer opportunities brought into the same workspace as the farm
          data that affects harvest timing.
        </p>
      </div>

      <div className="grid-cols-4">
        {snapshot.market.prices.map((price) => (
          <SectionCard key={price.crop} className="price-card">
            <div className="price-card__head">
              <span>{price.crop}</span>
              <span>{price.buyers} buyers</span>
            </div>
            <strong>{price.price}</strong>
            <p>{price.unit}</p>
            <div className="price-card__trend">
              {price.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{price.change}</span>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid-cols-2">
        <SectionCard title="Recent price history" description="A four-week view across core crops.">
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={snapshot.market.priceHistory}>
                <CartesianGrid stroke="rgba(212, 231, 193, 0.08)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <Tooltip
                  contentStyle={{
                    background: '#102116',
                    border: '1px solid rgba(154, 217, 110, 0.18)',
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="maize" fill="#8fd17c" radius={[8, 8, 0, 0]} />
                <Bar dataKey="tomatoes" fill="#5db8ff" radius={[8, 8, 0, 0]} />
                <Bar dataKey="spinach" fill="#efbb57" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Verified buyers"
          description="Potential off-takers with the strongest current fit for the farm."
        >
          <div className="list-stack">
            {snapshot.market.buyers.map((buyer) => (
              <article key={buyer.id} className="buyer-card">
                <div className="buyer-card__icon">
                  <ShoppingCart size={18} />
                </div>
                <div className="buyer-card__content">
                  <div className="buyer-card__header">
                    <strong>{buyer.name}</strong>
                    {buyer.verified ? (
                      <span className="verified-pill">
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p>
                    {buyer.type} · {buyer.distance} · {buyer.rating.toFixed(1)} rating
                  </p>
                  <span className="buyer-card__offer">{buyer.priceOffer}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
