"use client";

import { cn } from "@/lib/utils/shadcn";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, X } from "lucide-react";
import * as React from "react";

export interface Option {
  value: string;
  label: string;
  /** Extra fields, e.g. the key used by `groupBy`. */
  [key: string]: string | undefined;
}

type OptionGroup = { value: string; items: Option[] };

interface MultiSelectProps {
  value?: Option[];
  options?: Option[];
  placeholder?: string;
  onChange?: (options: Option[]) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
}

function groupOptions(options: Option[], groupBy: string): OptionGroup[] {
  const groups = new Map<string, Option[]>();
  for (const option of options) {
    const key = (option[groupBy] as string) || "";
    groups.set(key, [...(groups.get(key) ?? []), option]);
  }
  return Array.from(groups, ([value, items]) => ({ value, items }));
}

const isSameOption = (a: Option, b: Option) => a.value === b.value;

function OptionItem({ option }: { option: Option }) {
  return (
    <ComboboxPrimitive.Item
      value={option}
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-highlighted:bg-primary data-highlighted:text-primary-foreground"
    >
      <ComboboxPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Check className="h-4 w-4" />
      </ComboboxPrimitive.ItemIndicator>
      {option.label}
    </ComboboxPrimitive.Item>
  );
}

function MultiSelect({
  value,
  options = [],
  placeholder,
  onChange,
  hidePlaceholderWhenSelected,
  groupBy,
  className,
}: MultiSelectProps) {
  const items = React.useMemo(
    () => (groupBy ? groupOptions(options, groupBy) : options),
    [options, groupBy],
  );

  return (
    <ComboboxPrimitive.Root
      multiple
      items={items}
      value={value}
      isItemEqualToValue={isSameOption}
      onValueChange={(selected: Option[], eventDetails) => {
        // Base UI clears the selection on Escape; keep it, and let Escape
        // bubble so a surrounding dialog can still close.
        if (eventDetails.reason === "escape-key") {
          eventDetails.allowPropagation();
          return;
        }
        onChange?.(selected);
      }}
    >
      <ComboboxPrimitive.InputGroup
        className={cn(
          "min-h-10 cursor-text rounded border border-border bg-white px-3 py-1 text-sm ring-offset-background",
          className,
        )}
      >
        <ComboboxPrimitive.Chips className="flex flex-wrap items-center gap-1">
          <ComboboxPrimitive.Value>
            {(selected: Option[]) => (
              <>
                {selected.map((option) => (
                  <ComboboxPrimitive.Chip
                    key={option.value}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground outline-none focus-within:ring-2 focus-within:ring-ring"
                  >
                    {option.label}
                    <ComboboxPrimitive.ChipRemove
                      aria-label={`Remove ${option.label}`}
                      className="ml-1 rounded-full outline-none"
                    >
                      <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                    </ComboboxPrimitive.ChipRemove>
                  </ComboboxPrimitive.Chip>
                ))}
                <ComboboxPrimitive.Input
                  placeholder={
                    hidePlaceholderWhenSelected && selected.length !== 0
                      ? ""
                      : placeholder
                  }
                  className="min-w-12 flex-1 border-0 bg-transparent px-1 py-1 outline-none placeholder:text-muted-foreground focus:ring-0"
                />
              </>
            )}
          </ComboboxPrimitive.Value>
        </ComboboxPrimitive.Chips>
      </ComboboxPrimitive.InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner sideOffset={4} className="z-50">
          <ComboboxPrimitive.Popup className="max-h-[min(var(--available-height),300px)] w-(--anchor-width) overflow-y-auto overscroll-contain rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none">
            <ComboboxPrimitive.Empty className="py-6 text-center text-sm empty:hidden">
              No results found.
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List>
              {(item: Option | OptionGroup) =>
                "items" in item && Array.isArray(item.items) ? (
                  <ComboboxPrimitive.Group key={item.value} items={item.items}>
                    {item.value && (
                      <ComboboxPrimitive.GroupLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {item.value}
                      </ComboboxPrimitive.GroupLabel>
                    )}
                    <ComboboxPrimitive.Collection>
                      {(option: Option) => (
                        <OptionItem key={option.value} option={option} />
                      )}
                    </ComboboxPrimitive.Collection>
                  </ComboboxPrimitive.Group>
                ) : (
                  <OptionItem key={item.value} option={item as Option} />
                )
              }
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}

export default MultiSelect;
