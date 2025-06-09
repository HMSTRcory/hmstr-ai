'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type CallEngageMetricsProps = {
  clientId: number;
  dateRange: DateRange | undefined;
};

interface Metrics {
  qualified_leads: number | null;
  qualified_leads_ppc: number | null;
  qualified_leads_lsa: number | null;
  qualified_leads_seo: number | null;
  spend_ppc: number | null;
  spend_lsa: number | null;
  spend_seo: number | null;
  spend_total: number | null;
  cpql_ppc: number | null;
  cpql_lsa: number | null;
  cpql_seo: number | null;
  cpql_total: number | null;
}

export default function CallEngageMetrics({ clientId, dateRange }: CallEngageMetricsProps) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      const start = dateRange.from.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const end = dateRange.to.toLocaleDateString('en-CA');

      const { data, error } = await supabase.rpc('get_top_metrics', {
        input_client_id: clientId,
        input_start_date: start,
        input_end_date: end,
      });

      if (error) {
        console.error('Supabase RPC Error:', error.message);
        setData(null);
      } else {
        setData(data?.[0] || null);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  const formatCurrency = (value: number | null) =>
    value !== null ? `$${Number(value).toFixed(2)}` : '-';

  return (
    <div className="bg-white text-black p-6 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Call Engagement Metrics (Testing RPC)</h2>
      <p className="mb-2 text-gray-600">
        {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Qualified Leads: {data?.qualified_leads ?? '-'}</p>
          <p>CPQL Total: {formatCurrency(data?.cpql_total ?? null)}</p>
        </>
      )}
    </div>
  );
}
