'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface Metrics {
  her_percent: number | null;
  aifr_percent: number | null;
  human_engaged_true: number | null;
  total_engagements: number | null;
  ai_forwarded: number | null;
  total_forwarded: number | null;
}

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('view_call_engagement_metrics_v2')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error) {
        console.error('Supabase View Fetch Error:', error);
      }

      setData(data);
    };

    fetchMetrics();
  }, [clientId]);

  return (
    <section className="bg-white rounded-lg p-4 shadow-md space-y-4">
      <h2 className="text-xl font-bold mb-2">Call Engagement Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Human Engagement Rate</p>
          <p className="text-lg font-semibold">{data?.her_percent ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">AI Forward Rate</p>
          <p className="text-lg font-semibold">{data?.aifr_percent ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Human Engaged</p>
          <p className="text-lg font-semibold">
            {data?.human_engaged_true ?? 0} of {data?.total_engagements ?? 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">AI Forwarded</p>
          <p className="text-lg font-semibold">
            {data?.ai_forwarded ?? 0} of {data?.total_forwarded ?? 0}
          </p>
        </div>
      </div>
    </section>
  );
}
