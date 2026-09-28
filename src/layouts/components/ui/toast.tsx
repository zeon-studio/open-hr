"use client";

import { cn } from "@/lib/utils/shadcn";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CircleCheck, CircleX, X } from "lucide-react";

type ToastType = "success" | "error";
type ToastOptions = { description?: React.ReactNode; timeout?: number };

// Global manager so toasts can be queued from anywhere (hooks, callbacks,
// plain functions) and rendered by the single <Toaster /> in the root layout.
const toastManager = ToastPrimitive.createToastManager();

const addToast =
  (type?: ToastType) =>
  (title: React.ReactNode, options: ToastOptions = {}) =>
    toastManager.add({ title, type, ...options });

const toast = Object.assign(addToast(), {
  success: addToast("success"),
  error: addToast("error"),
  dismiss: (id: string) => toastManager.close(id),
});

const icons: Record<ToastType, React.ReactNode> = {
  success: <CircleCheck className="size-4 shrink-0 text-success" />,
  error: <CircleX className="size-4 shrink-0 text-destructive" />,
};

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      className={cn(
        "[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] h-(--height) w-full origin-bottom select-none rounded-md border border-border bg-white text-text-dark shadow-lg",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-starting-style:[transform:translateY(150%)] data-ending-style:opacity-0 data-limited:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
      )}
    >
      <ToastPrimitive.Content className="flex items-center gap-3 overflow-hidden px-4 py-3 transition-opacity duration-250 data-behind:opacity-0 data-expanded:opacity-100">
        {icons[item.type as ToastType]}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastPrimitive.Title className="text-sm font-medium" />
          <ToastPrimitive.Description className="text-sm text-text-light" />
        </div>
        <ToastPrimitive.Close
          aria-label="Close"
          className="shrink-0 rounded opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} timeout={4000}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-100 w-[calc(100vw-2rem)] sm:right-8 sm:bottom-8 sm:w-90">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { toast, Toaster };
