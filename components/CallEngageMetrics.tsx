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
  client_id: number;
  action_date: string;
  her_percent: number;
  aifr_percent: number;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
}

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
  const supabase = createClientComponentClient();
  const [rows, setRows] = useState<EngagementRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
      const formattedTo = format(dateRange.to, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('view_call_engagement_metrics_v2')
        .select('*')
        .eq('client_id', clientId)
        .gte('action_date', formattedFrom)
        .lte('action_date', formattedTo);

      if (error) {
        console.error('Supabase fetch error:', error);
        return;
      }

      setRows(data as EngagementRow[]);
    };

    fetchData();
  }, [clientId, dateRange]);

  const sum = (key: keyof EngagementRow) =>
    rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);

  const totalEngagements = sum('total_engagements');
  const humanEngaged = sum('human_engaged_true');
  const aiForwarded = sum('ai_forwarded');
  const totalForwarded = sum('total_forwarded');

  const herPercent =
    totalEngagements > 0
      ? `${((humanEngaged / totalEngagements) * 100).toFixed(2)}%`
      : '-';

  const aifrPercent =
    totalForwarded > 0
      ? `${((aiForwarded / totalForwarded) * 100).toFixed(2)}%`
      : '-';

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Call Engagement Metrics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Human Engagement Rate</div>
          <div className="text-2xl font-bold">{herPercent}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">AI Forward Rate</div>
          <div className="text-2xl font-bold">{aifrPercent}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Human Engaged</div>
          <div className="text-lg">
            {humanEngaged} of {totalEngagements}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">AI Forwarded</div>
          <div className="text-lg">
            {aiForwarded} of {totalForwarded}
          </div>
        </div>
      </div>
    </section>
  );
}
