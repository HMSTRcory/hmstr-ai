"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DateRange } from "react-day-picker";

const formatDate = (date: Date): string =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

type EngagementData = {
  her_percent: string;
  aifr_percent: string;
  human_engaged_true: number;
  total_engagements: number;
  ai_forwarded: number;
  total_forwarded: number;
};

export default function CallEngageMetrics({
  clientId,
  dateRange,
}: {
  clientId: number;
  dateRange: DateRange | undefined;
}) {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchEngagementMetrics = async () => {
      if (clientId && dateRange?.from && dateRange?.to) {
        try {
          const { data, error } = await supabase.rpc("get_call_engagement_metrics", {
            input_client_id: clientId,
            input_start_date: formatDate(dateRange.from),
            input_end_date: formatDate(dateRange.to),
          });

          console.log("📊 Supabase RPC Data:", data);
          console.log("⚠️ Supabase RPC Error:", error);

          if (error) throw error;
          if (data && data.length > 0) {
            setEngagementData(data[0]);
          } else {
            setEngagementData(null);
          }
        } catch (err) {
          console.error("❌ Failed to fetch engagement metrics:", err);
          setEngagementData(null);
        }
      }
    };

    fetchEngagementMetrics();
  }, [clientId, dateRange]);

  return (
    <section>
      <h2 className="text-xl font-semibold">Call Engagement Metrics</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Human Engagement Rate</p>
          <p className="text-lg font-medium">
            {engagementData?.her_percent ?? "0.00"}% (
            {engagementData?.human_engaged_true ?? 0} of{" "}
            {engagementData?.total_engagements ?? 0})
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">AI Forward Rate</p>
          <p className="text-lg font-medium">
            {engagementData?.aifr_percent ?? "0.00"}% (
            {engagementData?.ai_forwarded ?? 0} of{" "}
            {engagementData?.total_forwarded ?? 0})
          </p>
        </div>
      </div>
    </section>
  );
}
