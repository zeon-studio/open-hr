import * as React from "react";

import { cn } from "@/lib/shadcn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex border-border/30 min-h-[100px] w-full rounded bg-white px-3 py-2 text-sm placeholder:text-light focus:outline-none focus:border-border disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
