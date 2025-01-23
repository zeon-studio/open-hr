import { cn } from "@/lib/shadcn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex capitalize items-center rounded-md border px-2.5 py-1 font-medium text-xs transition-colors focus:outline-none focus:ring-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-light text-text",
        success: "border-transparent bg-[#E5F5EC] text-[#009B3E]",
        error: "border-transparent bg-[#FAE6E4] text-[#E14524]",
        info: "border-transparent bg-[#c4d9f7] text-[#0d6efd]",
        warning: "border-transparent bg-[#fffed9] text-[#ffc107]",
        secondary: "border-transparent bg-secondary text-secondary-foreground ",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground ",
        outline: "text-foreground border",
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
