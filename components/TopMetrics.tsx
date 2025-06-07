'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface TopMetricsProps {
  clientId: number;
  dateRange: DateRange | undefined;
}

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

export default function TopMetrics({ clientId, dateRange }: TopMetricsProps) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      const start = dateRange.from.toLocaleDateString('en-CA');
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

  const formatRange = () => {
    if (!dateRange?.from || !dateRange?.to) return '-';
    const from = dateRange.from.toLocaleDateString();
    const to = dateRange.to.toLocaleDateString();
    return `${from} - ${to}`;
  };

  return (
    <div className="bg-white text-black p-6 mt-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Top Metrics</h2>
      <p className="mb-2 text-gray-600">{formatRange()}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Leads: {data?.qualified_leads ?? '-'}</p>
          <p>PPC Leads: {data?.qualified_leads_ppc ?? '-'}</p>
          <p>LSA Leads: {data?.qualified_leads_lsa ?? '-'}</p>
          <p>SEO Leads: {data?.qualified_leads_seo ?? '-'}</p>
          <p>Total Spend: {formatCurrency(data?.spend_total ?? null)}</p>
          <p>Total PPC Spend: {formatCurrency(data?.spend_ppc ?? null)}</p>
          <p>LSA Spend: {formatCurrency(data?.spend_lsa ?? null)}</p>
          <p>SEO Spend: {formatCurrency(data?.spend_seo ?? null)}</p>
          <p>CPQL Total: {formatCurrency(data?.cpql_total ?? null)}</p>
          <p>CPQL PPC: {formatCurrency(data?.cpql_ppc ?? null)}</p>
          <p>CPQL LSA: {formatCurrency(data?.cpql_lsa ?? null)}</p>
          <p>CPQL SEO: {formatCurrency(data?.cpql_seo ?? null)}</p>
        </>
      )}
    </div>
  );
}
