"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

export const description = "An area chart with a legend";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "color-main",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

//TODO: поставить лейбл впм по середине

export function ChartAreaLegend({
  data,
}: {
  data: { second: number; wpm: number }[];
}) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="second"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              dataKey="wpm"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Words per minute",
                angle: -90,
                position: "left",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_, items) =>
                    items && items[0] ? `${items[0].payload.second}` : ""
                  }
                />
              }
            />
            {/* <Area
              dataKey="wpm"
              type="natural"
              fill="var(--color-main)"
              fillOpacity={0.4}
              stroke="var(--color-main)"
              stackId="a"
            /> */}
            <Area
              dataKey="wpm"
              type="natural"
              fill="var(--color-sub)"
              fillOpacity={0.4}
              stroke="var(--color-sub)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
