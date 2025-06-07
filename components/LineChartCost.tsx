'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { createClient } from '@/utils/supabase/client';

interface LineChartCostProps {
  clientId: number;
  dateRange?: DateRange;
}

export default function LineChartCost({ clientId, dateRange }: LineChartCostProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      setLoading(true);

      const { data, error } = await supabase.rpc('get_cpql_line_chart_metrics', {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split('T')[0],
        input_end_date: dateRange.to.toISOString().split('T')[0],
        input_group_by: 'month', // Hardcoded to "month"
      });

      if (error) {
        console.error('Error fetching CPQL data:', error);
      } else {
        setData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, [clientId, dateRange, supabase]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Cost Per Qualified Lead by Period</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="group_date" />
              <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="cpql_total" stroke="#8884d8" name="Total" />
              <Line type="monotone" dataKey="cpql_ppc" stroke="#82ca9d" name="PPC" />
              <Line type="monotone" dataKey="cpql_lsa" stroke="#ffc658" name="LSA" />
              <Line type="monotone" dataKey="cpql_seo" stroke="#ff7300" name="SEO" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
