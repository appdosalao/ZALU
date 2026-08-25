import { forwardRef, useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  loading?: boolean;
  inputClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, inputClassName, value, defaultValue, onChange, loading, disabled, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string>(
      String(value ?? defaultValue ?? "")
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value ?? ""));
      }
    }, [value]);

    const hasValue = (value !== undefined ? String(value ?? "") : internalValue).length > 0;

    const handleClear = () => {
      setInternalValue("");
      if (ref && typeof ref === "object" && ref.current) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        setter?.call(ref.current, "");
        ref.current.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    return (
      <div className={cn("group relative w-full", className)}>
        <div
          className={cn(
            "pointer-events-none absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-inset ring-primary/10 transition-all duration-300 group-focus-within:bg-primary/10 group-focus-within:ring-primary/25 group-focus-within:scale-110",
            hasValue && "bg-primary/10 ring-primary/25"
          )}
        >
          <Search
            className={cn(
              "h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary",
              hasValue && "text-primary"
            )}
            strokeWidth={2.2}
          />
        </div>

        <Input
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            setInternalValue(e.target.value);
            onChange?.(e);
          }}
          disabled={disabled}
          className={cn(
            "h-11 md:h-10 rounded-xl pl-12 pr-12 border-border/60 bg-background/70 backdrop-blur-sm shadow-[var(--shadow-soft)] transition-all duration-300",
            "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0 focus-visible:border-primary/40",
            "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)_/_0.08),0_4px_14px_-6px_hsl(var(--primary)_/_0.35)]",
            "placeholder:text-muted-foreground/70",
            inputClassName
          )}
          {...props}
        />

        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
        ) : hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-in zoom-in-95 fade-in duration-150"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>
        ) : (
          <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 blur-[1px] transition-opacity duration-300 group-focus-within:opacity-100" />
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
