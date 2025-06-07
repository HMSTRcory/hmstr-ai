'use client';

import { useEffect, useState } from 'react';
import { DashboardFilters } from '@/components/DashboardFilters';
import TopMetrics from '@/components/TopMetrics';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Client {
  client_id: number;
  cr_company_name: string;
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [clientId, setClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from('clients_ffs').select('client_id, cr_company_name');
      if (error) {
        console.error('Error loading clients:', error.message);
      } else {
        console.log('Clients fetched:', data);
        setClients(data || []);
        if (data && data.length > 0) {
          setClientId(data[0].client_id);
        }
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
      {clientId !== null && (
        <>
          <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />
          <TopMetrics clientId={clientId} dateRange={dateRange} />
        </>
      )}
    </main>
  );
}
