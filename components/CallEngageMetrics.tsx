"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DateRange } from "react-day-picker";

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
  const [engagementData, setEngagementData] = useState<EngagementData | null>(
    null
  );

  useEffect(() => {
    const fetchEngagementMetrics = async () => {
      if (!clientId || !dateRange?.from || !dateRange?.to) return;

      const supabase = createClient();

      const { data, error } = await supabase.rpc("get_call_engagement_metrics", {
        input_client_id: clientId,
        input_start_date: dateRange.from.toISOString().split("T")[0],
        input_end_date: dateRange.to.toISOString().split("T")[0],
      });

      if (error) {
        console.error("Error fetching call engagement metrics:", error);
      } else {
        console.log("Call engagement data:", data);
        setEngagementData(data?.[0] ?? null);
      }
    };

    fetchEngagementMetrics();
  }, [clientId, dateRange]);

  if (!engagementData) {
    return (
      <section>
        <h2 className="text-xl font-semibold">Call Engagement Metrics</h2>
        <p className="text-muted-foreground">No data available for this period.</p>
      </section>
    );
  }

  const {
    her_percent,
    aifr_percent,
    human_engaged_true,
    total_engagements,
    ai_forwarded,
    total_forwarded,
  } = engagementData;

  return (
    <section>
      <h2 className="text-xl font-semibold">Call Engagement Metrics</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Human Engagement Rate</p>
          <p className="text-lg font-medium">{her_percent}% ({human_engaged_true} of {total_engagements})</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">AI Forward Rate</p>
          <p className="text-lg font-medium">{aifr_percent}% ({ai_forwarded} of {total_forwarded})</p>
        </div>
      </div>
    </section>
  );
}
