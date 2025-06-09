'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface Metrics {
  her_percent: string | number | null;
  aifr_percent: string | number | null;
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
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      setLoading(true);
      const { data, error } = await supabase.rpc('get_call_engagement_metrics_v2', {
        input_client_id: clientId,
        input_start_date: dateRange.from.toLocaleDateString('en-CA'),
        input_end_date: dateRange.to.toLocaleDateString('en-CA'),
      });

      if (error) {
        setData(null);
      } else {
        setData(data?.[0] ?? null);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Call Engagement Metrics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Human Engagement Rate</p>
            <p className="text-lg font-semibold">
              {data.her_percent !== null ? `${data.her_percent}%` : '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">AI Forward Rate</p>
            <p className="text-lg font-semibold">
              {data.aifr_percent !== null ? `${data.aifr_percent}%` : '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Human Engaged</p>
            <p className="text-lg font-semibold">
              {data.human_engaged_true ?? '-'} of {data.total_engagements ?? '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">AI Forwarded</p>
            <p className="text-lg font-semibold">
              {data.ai_forwarded ?? '-'} of {data.total_forwarded ?? '-'}
            </p>
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </section>
  );
}
