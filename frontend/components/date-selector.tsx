"use client";
import { CalendarIcon } from "lucide-react";
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
            <PopoverTrigger render={<Button variant="outline" className="w-72 justify-start font-normal" />}>
                <CalendarIcon className="mr-2 size-4" />
                Pick a date range
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
