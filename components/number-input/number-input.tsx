"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import "./style.css";

interface NumberInputProps<T extends FieldValues>
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name"
    >,
    UseControllerProps<T> {
  prefix?: string;
  suffix?: string;
  postChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps<any>>(
  ({ prefix, suffix, postChange, className, type, ...props }, ref) => {
    const { field } = useController(props);

    return (
      <div className="relative">
        {prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          className={cn(
            `ps-${prefix ? 12 : 4}`,
            `pe-${suffix ? 12 : 4}`,
            "no-caret",
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

            className,
          )}
          {...field}
          {...props}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            const parsedValue = value === "" ? "" : Number(value);

            field.onChange(parsedValue);
            if (postChange) {
              postChange(value === "" ? 0 : Number(value));
            }
          }}
        />

        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);
export { NumberInput };
