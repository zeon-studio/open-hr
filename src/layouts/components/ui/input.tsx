import * as React from "react";

import { cn } from "@/lib/shadcn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded border border-border/10 read-only:border-none focus:border-border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:pl-0",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
