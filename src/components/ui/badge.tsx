import { cn } from "@/lib/shadcn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex capitalize items-center rounded-md border px-2.5 py-1 font-medium text-xs transition-colors focus:outline-none focus:ring-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/5 text-primary",
        success: "border-transparent bg-success/5 text-success",
        warning: "border-transparent bg-warning/5 text-warning",
        destructive: "border-transparent bg-destructive/5 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
