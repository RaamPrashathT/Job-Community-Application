"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  readonly value?: Date | null;
  readonly onChange: (date: Date | undefined) => void;
  readonly disabled?: boolean;
  readonly placeholder?: string;
}

export function DatePicker({ value, onChange, disabled, placeholder = "Pick a date" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] hover:bg-[#1C1C1C] hover:text-[#F0F0F0]"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span className="text-[#666666]">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#111111] border-[#2A2A2A]" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={onChange}
          className="bg-[#111111] text-[#F0F0F0]"
        />
      </PopoverContent>
    </Popover>
  );
}
