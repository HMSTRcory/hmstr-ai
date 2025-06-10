'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface EngagementRow {
  action_date: string;
  her_percent: number | null;
  aifr_percent: number | null;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
}

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
  const supabase = createClientComponentClient();
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;
      setLoading(true);

      const from = format(dateRange.from, 'yyyy-MM-dd');
      const to = format(dateRange.to, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('view_call_engagement_metrics_v2')
        .select('*')
        .eq('client_id', clientId)
        .gte('action_date', from)
        .lte('action_date', to);

      if (error) {
        console.error('Error fetching engagement metrics:', error);
        setRows([]);
      } else {
        setRows(data);
      }

      setLoading(false);
    }

    fetchMetrics();
  }, [clientId, dateRange]);

  // Aggregate
  const sum = (key: keyof EngagementRow) =>
    rows.reduce((acc, row) => acc + Number(row[key] ?? 0), 0);

  const totalEngagements = sum('total_engagements');
  const humanEngaged = sum('human_engaged_true');
  const aiForwarded = sum('ai_forwarded');
  const totalForwarded = sum('total_forwarded');

  const herPercent =
    totalEngagements > 0 ? ((humanEngaged / totalEngagements) * 100).toFixed(2) : '-';
  const aifrPercent =
    totalForwarded > 0 ? ((aiForwarded / totalForwarded) * 100).toFixed(2) : '-';

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Call Engagement Metrics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500">Human Engagement Rate</div>
            <div className="text-2xl font-bold">{herPercent}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">AI Forward Rate</div>
            <div className="text-2xl font-bold">{aifrPercent}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Human Engaged</div>
            <div className="text-xl">
              {humanEngaged} of {totalEngagements}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">AI Forwarded</div>
            <div className="text-xl">
              {aiForwarded} of {totalForwarded}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
