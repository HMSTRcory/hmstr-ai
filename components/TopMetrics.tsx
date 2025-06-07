// TopMetrics.tsx

import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

interface TopMetricsProps {
  clientId: number;
  dateRange?: DateRange;
}

export default function TopMetrics({ clientId, dateRange }: TopMetricsProps) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);

      const start = dateRange?.from?.toISOString().slice(0, 10);
      const end = dateRange?.to?.toISOString().slice(0, 10);

      if (!start || !end) return;

      const { data, error } = await supabase.rpc('get_top_metrics', {
        input_client_id: clientId,
        input_start_date: start,
        input_end_date: end,
      });

      if (error) {
        console.error('Error fetching metrics:', error);
      } else {
        setData(data);
      }

      setLoading(false);
    };

    if (dateRange?.from && dateRange?.to) {
      fetchMetrics();
    }
  }, [clientId, dateRange, supabase]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        {dateRange?.from && dateRange?.to
          ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
          : 'Select a date range'}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Leads: {data?.qualified_leads ?? '-'}</p>
          <p>PPC Leads: {data?.qualified_leads_ppc ?? '-'}</p>
          <p>LSA Leads: {data?.qualified_leads_lsa ?? '-'}</p>
          <p>SEO Leads: {data?.qualified_leads_seo ?? '-'}</p>
          <p>Total Spend: {formatCurrency(data?.spend_total ?? 0)}</p>
          <p>CPQL Total: {formatCurrency(data?.cpql_total ?? 0)}</p>
        </div>
      )}
    </div>
  );
}
