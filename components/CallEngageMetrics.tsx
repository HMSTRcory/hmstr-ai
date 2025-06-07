"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallEngageMetricsProps {
  herPercent?: string;
  aifrPercent?: string;
  humanEngagedTrue?: number;
  totalEngagements?: number;
  aiForwarded?: number;
  totalForwarded?: number;
}

export default function CallEngageMetrics({
  herPercent,
  aifrPercent,
  humanEngagedTrue,
  totalEngagements,
  aiForwarded,
  totalForwarded,
}: CallEngageMetricsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Call Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Human Engagement Rate</p>
          <p className="text-lg font-medium">{herPercent ?? "--"}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">AI Forward Rate</p>
          <p className="text-lg font-medium">{aifrPercent ?? "--"}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Humans Engaged</p>
          <p className="text-lg font-medium">{humanEngagedTrue ?? "--"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Engagements</p>
          <p className="text-lg font-medium">{totalEngagements ?? "--"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">AI Forwarded</p>
          <p className="text-lg font-medium">{aiForwarded ?? "--"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Forwarded</p>
          <p className="text-lg font-medium">{totalForwarded ?? "--"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
