// TopMetrics.tsx
import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface TopMetricsProps {
  clientId: number;
  dateRange?: DateRange;
}

export function TopMetrics({ clientId, dateRange }: TopMetricsProps) {
  const supabase = createClient();
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);

      const fromDate = dateRange?.from?.toISOString();
      const toDate = dateRange?.to?.toISOString();

      let query = supabase
        .from('hmstr_leads')
        .select('id', { count: 'exact' })
        .eq('client_id', clientId);

      if (fromDate) {
        query = query.gte('timestamp', fromDate);
      }
      if (toDate) {
        query = query.lte('timestamp', toDate);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Failed to fetch lead count:', error);
        setLeadCount(null);
      } else {
        setLeadCount(count ?? 0);
      }

      setLoading(false);
    }

    fetchMetrics();
  }, [clientId, dateRange]);

  return (
    <div className="mt-4">
      {loading ? <p>Loading...</p> : <p className="text-lg">Leads: {leadCount}</p>}
    </div>
  );
}
