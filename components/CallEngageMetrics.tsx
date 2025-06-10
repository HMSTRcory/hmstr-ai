'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface MetricsRow {
  action_date: string;
  her_percent: number | null;
  aifr_percent: number | null;
  human_engaged_true: number | null;
  total_engagements: number | null;
  ai_forwarded: number | null;
  total_forwarded: number | null;
}

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
  const supabase = createClientComponentClient();
  const [metrics, setMetrics] = useState<MetricsRow[]>([]);

  useEffect(() => {
    if (!clientId || !dateRange?.from || !dateRange?.to) return;

    const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
    const formattedTo = format(dateRange.to, 'yyyy-MM-dd');

    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('view_call_engagement_metrics_v2')
        .select('*')
        .eq('client_id', clientId)
        .gte('action_date', formattedFrom)
        .lte('action_date', formattedTo)
        .order('action_date', { ascending: true });

      if (error) {
        console.error('Supabase View Fetch Error:', error);
      } else {
        setMetrics(data || []);
      }
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  const latest = metrics[metrics.length - 1];

  return (
    <section className="bg-white rounded-lg p-4 shadow-md space-y-6">
      <h2 className="text-xl font-bold">Call Engagement Metrics</h2>

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Human Engagement Rate</p>
            <p className="text-lg font-semibold">
              {latest.her_percent != null ? `${latest.her_percent}%` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">AI Forward Rate</p>
            <p className="text-lg font-semibold">
              {latest.aifr_percent != null ? `${latest.aifr_percent}%` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Human Engaged</p>
            <p className="text-lg font-semibold">
              {latest.human_engaged_true ?? 0} of {latest.total_engagements ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">AI Forwarded</p>
            <p className="text-lg font-semibold">
              {latest.ai_forwarded ?? 0} of {latest.total_forwarded ?? 0}
            </p>
          </div>
        </div>
      )}

      {metrics.length > 1 && (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="action_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="her_percent" stroke="#8884d8" name="HER %" />
            <Line type="monotone" dataKey="aifr_percent" stroke="#82ca9d" name="AIFR %" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
