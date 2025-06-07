'use client';

import { useEffect, useState } from 'react';
import { DashboardFilters } from '@/components/DashboardFilters';
import TopMetrics from '@/components/TopMetrics';
import { DateRange } from 'react-day-picker';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Client {
  client_id: number;
  name: string;
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [clientId, setClientId] = useState<number>(20);
  const [clients, setClients] = useState<Client[]>([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from('clients_ffs').select('client_id, name');
      if (error) {
        console.error('Error loading clients:', error.message);
      } else {
        setClients(data || []);
      }
    };
    fetchClients();
  }, []);

  return (
    <main className="p-6 bg-gray-100 text-black max-w-[800px] mx-auto min-h-screen">
      <div className="mb-4">
        <label htmlFor="client" className="block text-sm font-medium mb-1">
          Select Client
        </label>
        <select
          id="client"
          value={clientId}
          onChange={(e) => setClientId(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-full text-black"
        >
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />
      <TopMetrics clientId={clientId} dateRange={dateRange} />
    </main>
  );
}
