'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type CallEngageMetricsProps = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface Metrics {
  her_percent: string | null;
  aifr_percent: string | null;
  human_engaged_true: number | null;
  total_engagements: number | null;
  ai_forwarded: number | null;
  total_forwarded: number | null;
}

export default function CallEngageMetrics({ clientId, dateRange }: CallEngageMetricsProps) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      const start = dateRange.from.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const end = dateRange.to.toLocaleDateString('en-CA');

      const { data, error } = await supabase.rpc('get_call_engagement_metrics_v2', {
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

  const percentOrDash = (val: string | null) =>
    val !== null ? `${parseFloat(val).toFixed(2)}%` : '-';

  const ratioOrDash = (num: number | null, denom: number | null) =>
    denom ? `${num} of ${denom}` : '0 of 0';

  return (
    <div className="bg-white text-black p-6 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Call Engagement Metrics</h2>
      <p className="mb-2 text-gray-600">
        {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Human Engagement Rate: {percentOrDash(data?.her_percent ?? null)}</p>
          <p>AI Forward Rate: {percentOrDash(data?.aifr_percent ?? null)}</p>
          <p>Human Engaged: {ratioOrDash(data?.human_engaged_true ?? 0, data?.total_engagements ?? 0)}</p>
          <p>AI Forwarded: {ratioOrDash(data?.ai_forwarded ?? 0, data?.total_forwarded ?? 0)}</p>
        </>
      )}
    </div>
  );
}
