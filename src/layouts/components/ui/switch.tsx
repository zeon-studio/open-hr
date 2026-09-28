"use client";

import { cn } from "@/lib/utils/shadcn";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as React from "react";

const Switch = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-muted inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="bg-background pointer-events-none block size-5 rounded-full shadow-lg ring-0 transition-transform data-checked:translate-x-5 data-unchecked:translate-x-0" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export { Switch };
