import { DashboardFilters } from '@/components/DashboardFilters';
import { TopMetrics } from '@/components/TopMetrics';

export default function Home() {
  return (
    <main className="p-6">
      <DashboardFilters />
      <TopMetrics />
    </main>
  );
}
