"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import RenderErrorDot from "./RenderErrorDots";
import AnimatedWpmDot from "./AnimatedWpmDot";
import { useMediaQuery } from "@/hooks/use-media-query";

export const description = "An area chart with a legend";

const chartConfig = {
  wpm: { label: "WPM", color: "var(--color-sub)" },
  errors: { label: "Errors", color: "var(--color-error)" },
} satisfies ChartConfig;

export function ChartAreaLegend({
  wpmData,
  errorData,
}: {
  wpmData: { second: number; wpm: number }[];
  errorData: { second: number; errors: number }[];
}) {
  const chartData = useMemo(() => {
    const merged = new Map<
      number,
      { second: number; wpm: number; errors: number }
    >();

    for (const sample of wpmData) {
      merged.set(sample.second, {
        second: sample.second,
        wpm: sample.wpm,
        errors: 0,
      });
    }

    for (const sample of errorData) {
      const existing = merged.get(sample.second);
      if (existing) {
        existing.errors = sample.errors;
      } else {
        merged.set(sample.second, {
          second: sample.second,
          wpm: 0,
          errors: sample.errors,
        });
      }
    }

    return Array.from(merged.values())
      .sort((a, b) => a.second - b.second)
      .map((entry, index) => ({ ...entry, order: index }));
  }, [wpmData, errorData]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Card className="px-0 md:px-3">
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={
              isDesktop
                ? {
                    left: 12,
                    right: 12,
                    top: 8,
                  }
                : { top: 8 }
            }
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
              yAxisId={"wpm"}
              tickLine={false}
              axisLine={false}
              tickMargin={isDesktop ? 8 : 0}
              label={
                isDesktop
                  ? {
                      value: "Words per minute",
                      angle: -90,
                      position: "left",
                    }
                  : {}
              }
            />
            <YAxis
              dataKey="errors"
              yAxisId={"errors"}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={isDesktop ? 8 : 0}
              label={
                isDesktop
                  ? {
                      value: "Errors",
                      angle: -90,
                      position: "right",
                    }
                  : {}
              }
              // label={{
              //
              // }}
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
            <Area
              dataKey="wpm"
              yAxisId={"wpm"}
              type="monotone"
              fill="var(--color-sub)"
              fillOpacity={0.25}
              stroke="var(--color-sub)"
              strokeWidth={3}
              dot={<AnimatedWpmDot />}
              stackId="b"
              animationBegin={20}
            />
            <Area
              dataKey="errors"
              yAxisId="errors"
              type="monotone"
              stroke="var(--color-error)"
              strokeOpacity={0}
              strokeWidth={4}
              fill="none"
              fillOpacity={1}
              activeDot={false}
              animationBegin={20}
              dot={<RenderErrorDot />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
