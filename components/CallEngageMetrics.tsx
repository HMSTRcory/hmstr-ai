"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DateRange } from "react-day-picker";

type Props = {
  clientId: number | null;
  dateRange: DateRange | undefined;
};

export default function CallEngageMetrics({ clientId, dateRange }: Props) {
  const [metrics, setMetrics] = useState<{
    her_percent: string;
    aifr_percent: string;
    human_engaged_true: number;
    total_engagements: number;
    ai_forwarded: number;
    total_forwarded: number;
  } | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      const supabase = createClient();

      const { data, error } = await supabase.rpc("get_call_engagement_metrics", {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split("T")[0],
        input_end_date: dateRange.to.toISOString().split("T")[0],
      });

      console.log("Call Engagement Metrics RPC Response:", data, error);

      if (data && data.length > 0) {
        setMetrics(data[0]);
      }
    };

    fetchMetrics();
  }, [clientId, dateRange]);

  return (
    <section className="p-4 rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Call Engagement Metrics</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Human Engagement Rate (HER)
          </h3>
          <p className="text-2xl font-bold">
            {metrics?.her_percent ?? "0"}%
          </p>
          <p className="text-sm text-gray-400">
            {metrics
              ? `${metrics.human_engaged_true} of ${metrics.total_engagements} calls were human engaged`
              : "0 of 0 calls were human engaged"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            AI Forward Rate (AIFR)
          </h3>
          <p className="text-2xl font-bold">
            {metrics?.aifr_percent ?? "0"}%
          </p>
          <p className="text-sm text-gray-400">
            {metrics
              ? `${metrics.ai_forwarded} of ${metrics.total_forwarded} calls forwarded to AI`
              : "0 of 0 calls forwarded to AI"}
          </p>
        </div>
      </div>
    </section>
  );
}
