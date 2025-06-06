'use client';

import * as React from 'react';
import { Calendar as CalendarPrimitive } from 'react-day-picker';
import { cn } from '@/lib/utils';

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive>) => {
  return (
    <CalendarPrimitive
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        day_today: 'text-slate-900',
        day_selected: 'bg-slate-900 text-white',
        ...classNames,
      }}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';
