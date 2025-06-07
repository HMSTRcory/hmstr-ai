'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClient } from '@/utils/supabase/client';

interface CallEngageMetricsProps {
  clientId: number;
  dateRange?: DateRange;
}

interface CallEngageData {
  her_percent: string;
  aifr_percent: string;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
}

export default function CallEngageMetrics({ clientId, dateRange }: CallEngageMetricsProps) {
  const [data, setData] = useState<CallEngageData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_call_engagement_metrics', {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split('T')[0],
        input_end_date: dateRange.to.toISOString().split('T')[0]
      });

      if (error) {
        console.error('Error fetching call engagement metrics:', error);
        return;
      }

      setData(data?.[0] ?? null);
    };

    fetchData();
  }, [clientId, dateRange]);

  if (!data) return null;

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Call Engagement Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Human Engagement Rate (HER)</p>
          <p className="text-2xl font-bold">{data.her_percent}%</p>
          <p className="text-sm text-gray-500">
            {data.human_engaged_true} of {data.total_engagements} calls were human engaged
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">AI Forward Rate (AIFR)</p>
          <p className="text-2xl font-bold">{data.aifr_percent}%</p>
          <p className="text-sm text-gray-500">
            {data.ai_forwarded} of {data.total_forwarded} calls forwarded to AI
          </p>
        </div>
      </div>
    </div>
  );
}
