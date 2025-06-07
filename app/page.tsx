"use client";

import TopMetrics from "@/components/TopMetrics";
import LineChartMetrics from "@/components/LineChartMetrics";
import LineChartCost from "@/components/LineChartCost";
import { DateRange } from "react-day-picker";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import DashboardFilters from "@/components/DashboardFilters";

export default function Page() {
  const [clientId, setClientId] = useState<number | null>(20);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [callMetrics, setCallMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchCallEngagement = async () => {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_call_engagement_metrics", {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split("T")[0],
        input_end_date: dateRange.to.toISOString().split("T")[0],
      });
      if (!error) {
        setCallMetrics(data[0]);
      }
    };
    fetchCallEngagement();
  }, [clientId, dateRange]);

  return (
    <main className="space-y-8 p-6">
      <DashboardFilters
        clientId={clientId}
        setClientId={setClientId}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <TopMetrics clientId={clientId ?? 0} dateRange={dateRange} />

      {/* 📞 Call Engagement Metrics Section */}
      {callMetrics && (
        <div className="rounded-2xl border p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Call Engagement Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-gray-500">Human Engage Rate</div>
              <div className="text-lg font-medium">{callMetrics.her_percent}%</div>
            </div>
            <div>
              <div className="text-gray-500">AI Forward Rate</div>
              <div className="text-lg font-medium">{callMetrics.aifr_percent}%</div>
            </div>
            <div>
              <div className="text-gray-500">Humans Engaged</div>
              <div className="text-lg font-medium">{callMetrics.human_engaged_true}</div>
            </div>
            <div>
              <div className="text-gray-500">Total Engagements</div>
              <div className="text-lg font-medium">{callMetrics.total_engagements}</div>
            </div>
            <div>
              <div className="text-gray-500">AI Forwarded</div>
              <div className="text-lg font-medium">{callMetrics.ai_forwarded}</div>
            </div>
            <div>
              <div className="text-gray-500">Total Forwarded</div>
              <div className="text-lg font-medium">{callMetrics.total_forwarded}</div>
            </div>
          </div>
        </div>
      )}

      <LineChartMetrics clientId={clientId ?? 0} dateRange={dateRange} />
      <LineChartCost clientId={clientId ?? 0} dateRange={dateRange} groupBy="month" />
    </main>
  );
}
