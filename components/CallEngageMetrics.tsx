'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface Metrics {
  her_percent: string | null;
  aifr_percent: string | null;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
}

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
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
        console.error('Supabase RPC Error (CallEngageMetrics):', error.message);
        setData(null);
      } else {
        console.log('Call Engagement Metrics RPC Response:', data);
        setData(data?.[0] || null);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  return (
    <section className="bg-white text-black p-6 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Call Engagement Metrics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>
            <strong>HER:</strong> {data?.her_percent ?? '0'}% (
            {data?.human_engaged_true ?? 0} of {data?.total_engagements ?? 0})
          </p>
          <p>
            <strong>AIFR:</strong> {data?.aifr_percent ?? '0'}% (
            {data?.ai_forwarded ?? 0} of {data?.total_forwarded ?? 0})
          </p>
        </>
      )}
    </section>
  );
}
