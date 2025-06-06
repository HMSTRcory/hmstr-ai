'use client';

import { useEffect, useState } from 'react';
import { getClients, getTopMetrics, getHumanEngagementStats } from '@/lib/queries';

export default function TopMetrics() {
  const [clientId, setClientId] = useState<string>('client_1');
  const [startDate] = useState<string>('2024-01-01');
  const [endDate] = useState<string>('2024-12-31');
  const [topMetrics, setTopMetrics] = useState<any[]>([]);
  const [engagementStats, setEngagementStats] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const metrics = await getTopMetrics(clientId, startDate, endDate);
        setTopMetrics(metrics);

        const engagement = await getHumanEngagementStats(clientId, startDate, endDate);
        setEngagementStats(engagement);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    }

    fetchData();
  }, [clientId, startDate, endDate]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {topMetrics.map((metric) => (
        <div
          key={metric.metric_name}
          className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {metric.metric_name}
          </div>
          <div className="text-2xl font-bold">{metric.metric_value}</div>
        </div>
      ))}
    </div>
  );
}
