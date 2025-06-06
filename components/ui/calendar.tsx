import * as React from "react";
import { DayPicker, DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  mode?: "range";
  defaultMonth?: Date;
  selected?: DateRange;
  onSelect?: SelectRangeEventHandler;
  numberOfMonths?: number;
  className?: string;
}

export function Calendar({
  className,
  mode = "range",
  defaultMonth,
  selected,
  onSelect,
  numberOfMonths = 2,
  ...props
}: CalendarProps): React.ReactElement {
  return (
    <DayPicker
      className={cn("p-3", className)}
      mode={mode}
      defaultMonth={defaultMonth}
      selected={selected}
      onSelect={onSelect}
      numberOfMonths={numberOfMonths}
      {...props}
    />
  );
}
