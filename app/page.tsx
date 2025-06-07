'use client';

import { useEffect, useState } from 'react';
import { DashboardFilters } from '@/components/DashboardFilters';
import TopMetrics from '@/components/TopMetrics';
import LineChartMetrics from '@/components/LineChartMetrics';
import LineChartCost from '@/components/LineChartCost';
import { DateRange } from 'react-day-picker';
import { createClient } from '@/utils/supabase/client';

interface Client {
  client_id: number;
  cr_company_name: string;
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [clientId, setClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('clients_ffs')
        .select('client_id, cr_company_name');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data);
      if (!clientId && data.length > 0) {
        setClientId(data[0].client_id);
      }
    };

    fetchClients();
  }, []);

  return (
    <main className="p-6 bg-gray-100 text-black max-w-[1200px] mx-auto min-h-screen">
      <div className="mb-4">
        <label htmlFor="client" className="block text-sm font-medium mb-1">
          Select Client
        </label>
        <select
          id="client"
          value={clientId ?? ''}
          onChange={(e) => setClientId(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-full text-black"
        >
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.cr_company_name}
            </option>
          ))}
        </select>
      </div>

      <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />

      <TopMetrics clientId={clientId ?? 0} dateRange={dateRange} />
      <LineChartMetrics clientId={clientId ?? 0} dateRange={dateRange} />
      <LineChartCost clientId={clientId ?? 0} dateRange={dateRange} />
    </main>
  );
}
