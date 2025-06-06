// components/ui/datepicker.tsx
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DateRangePickerProps {
  dateRange: { startDate: Date | null; endDate: Date | null }
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void
}

export function DateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
  return (
    <DatePicker
      selectsRange
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onChange={([start, end]) => setDateRange({ startDate: start, endDate: end })}
      isClearable
      placeholderText="Select date range"
      className="border px-3 py-2 rounded"
    />
  )
}
