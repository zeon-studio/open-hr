import { clsx, type ClassValue } from "clsx";
import { isValidElement } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base UI triggers need `nativeButton={false}` when rendered as a non-button
// DOM element (e.g. `asChild` with a <div>). Components such as <Button>
// render a native <button>, so they count as native.
export function isNativeButton(element: unknown) {
  return !(
    isValidElement(element) &&
    typeof element.type === "string" &&
    element.type !== "button"
  );
}
