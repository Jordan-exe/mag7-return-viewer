"use client";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    value: DateRange;
    onChange: (range: DateRange) => void;
};

export function DateSelector({ value, onChange }: Props) {
    return (
        <Popover>
            <PopoverTrigger
                render={<Button variant="outline" className="h-10 w-full justify-start px-3 font-medium sm:w-72" />}
            >
                <CalendarIcon className="mr-2 size-4 text-teal" />
                {value.from && value.to
                    ? `${format(value.from, "MMM d, yyyy")} – ${format(value.to, "MMM d, yyyy")}`
                    : "Pick a date range"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    selected={value}
                    onSelect={(range) => range && onChange(range)}
                    numberOfMonths={2}
                    defaultMonth={value?.from}
                    disabled={{ after: new Date() }}
                />
            </PopoverContent>
        </Popover>
    );
}
