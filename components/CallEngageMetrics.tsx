'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface TopMetricsProps {
  clientId: number;
  dateRange: DateRange | undefined;
}

interface Metrics {
  her_percent: string | null;
  aifr_percent: string | null;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
}

export default function TopMetrics({ clientId, dateRange }: TopMetricsProps) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      const start = dateRange.from.toLocaleDateString('en-CA');
      const end = dateRange.to.toLocaleDateString('en-CA');

      const { data, error } = await supabase.rpc('get_call_engagement_metrics', {
        input_client_id: clientId,
        input_start_date: start,
        input_end_date: end,
      });

      if (error) {
        console.error('Supabase RPC Error:', error.message);
        setData(null);
      } else {
        setData(data?.[0] || null);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  const formatCurrency = (value: number | null) =>
    value !== null ? `$${Number(value).toFixed(2)}` : '-';

  const formatRange = () => {
    if (!dateRange?.from || !dateRange?.to) return '-';
    const from = dateRange.from.toLocaleDateString();
    const to = dateRange.to.toLocaleDateString();
    return `${from} - ${to}`;
  };

  return (
    <div className="bg-white text-black p-6 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Top Metrics</h2>
      <p className="mb-2 text-gray-600">{formatRange()}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>HER: {data?.her_percent ?? '0'}</p>
          <p>AIFR: {data?.aifr_percent ?? '0'}</p>
        </>
      )}
    </div>
  );
}
