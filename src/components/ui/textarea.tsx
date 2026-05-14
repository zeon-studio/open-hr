import * as React from "react";

import { cn } from "@/lib/shadcn";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex border-border min-h-[100px] w-full rounded bg-white px-3 py-2 text-sm placeholder:text-text-light focus:outline-none focus:border-border disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 read-only:border-none read-only:pl-0",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
