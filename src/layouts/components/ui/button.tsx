import { cn } from "@/lib/utils/shadcn";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        basic: "bg-transparent",
        default: "bg-primary text-primary-foreground rounded shadow",
        secondary: "bg-secondary text-secondary-foreground rounded shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-white hover:bg-primary hover:text-primary-foreground",
        input: "border border-border bg-white hover:border-border",
        success: "bg-success text-success-foreground hover:bg-success/80",
        ghost: "hover:bg-primary hover:text-primary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        lg: "h-11 px-8",
        sm: "h-9 px-3",
        xs: "h-7 px-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      render,
      nativeButton,
      ...props
    },
    ref,
  ) => {
    const renderProp =
      asChild && React.isValidElement(children)
        ? (children as React.ReactElement)
        : render;

    return (
      <ButtonPrimitive
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        render={renderProp}
        nativeButton={
          nativeButton ??
          (renderProp
            ? React.isValidElement(renderProp) && renderProp.type === "button"
            : undefined)
        }
        {...props}
      >
        {asChild ? undefined : children}
      </ButtonPrimitive>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
