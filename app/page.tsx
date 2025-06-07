'use client';

import { useState } from 'react';
import { DashboardFilters } from '@/components/DashboardFilters';
import TopMetrics from '@/components/TopMetrics';
import { DateRange } from 'react-day-picker';

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <main className="p-6 bg-gray-100 text-black max-w-[1200px] mx-auto min-h-screen">
      <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />
      <TopMetrics clientId={20} dateRange={dateRange} />
    </main>
  );
}
