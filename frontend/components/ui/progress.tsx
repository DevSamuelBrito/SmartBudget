"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number;
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
};

function Progress({ className, value = 0, indicatorClassName, indicatorStyle, ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn("h-full w-full bg-primary transition-transform", indicatorClassName)}
        style={{ transform: `translateX(-${100 - safeValue}%)`, ...indicatorStyle }}
      />
    </div>
  );
}

export { Progress };
