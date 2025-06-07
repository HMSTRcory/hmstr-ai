'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from 'react-day-picker';
import { createClient } from '@/utils/supabase/client';

type Props = {
  clientId: number;
  dateRange: DateRange | undefined;
};

type MetricRow = {
  group_date: string;
  qualified_leads: number;
  qualified_leads_ppc: number;
  qualified_leads_lsa: number;
  qualified_leads_seo: number;
};

export default function LineChartMetrics({ clientId, dateRange }: Props) {
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    async function fetchMetrics() {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_qualified_leads_line_chart_metrics', {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split('T')[0],
        input_end_date: dateRange.to.toISOString().split('T')[0],
        input_group_by: groupBy,
      });

      if (error) console.error(error);
      else setMetrics(data);
    }

    fetchMetrics();
  }, [clientId, dateRange, groupBy]);

  return (
    <div className="mt-8 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Qualified Leads by Period</h2>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group_date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="qualified_leads" stroke="#2563eb" name="Total" />
          <Line type="monotone" dataKey="qualified_leads_ppc" stroke="#16a34a" name="PPC" />
          <Line type="monotone" dataKey="qualified_leads_lsa" stroke="#eab308" name="LSA" />
          <Line type="monotone" dataKey="qualified_leads_seo" stroke="#9333ea" name="SEO" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
