'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from '@/utils/supabase/client';
import { DateRange } from 'react-day-picker';

interface LineData {
  group_date: string;
  ppc: string;
  lsa: string;
  seo: string;
}

interface Props {
  clientId: number;
  dateRange?: DateRange;
}

export default function LineChartMetrics({ clientId, dateRange }: Props) {
  const [data, setData] = useState<LineData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!dateRange?.from || !dateRange?.to || !clientId) return;

      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_cost_line_chart_metrics', {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split('T')[0],
        input_end_date: dateRange.to.toISOString().split('T')[0],
        input_group_by: 'day',
      });

      if (error) {
        console.error('RPC error:', error);
        return;
      }

      setData(data || []);
    };

    fetchChartData();
  }, [clientId, dateRange]);

  return (
    <div className="w-full h-[400px] mt-8 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daily Spend Breakdown</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="group_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ppc" stroke="#8884d8" name="PPC" dot={false} />
          <Line type="monotone" dataKey="lsa" stroke="#82ca9d" name="LSA" dot={false} />
          <Line type="monotone" dataKey="seo" stroke="#ffc658" name="SEO" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
