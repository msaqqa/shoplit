"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React from "react";

function TodoList() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Todo List</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            className="rounded-lg border w-full"
          />
        </PopoverContent>
      </Popover>

      <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
        {/* LIST ITEM */}
        <div className="flex flex-col gap-4">
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item1" checked />
              <label htmlFor="item1" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item2" checked />
              <label htmlFor="item2" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item3" />
              <label htmlFor="item3" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item4" checked />
              <label htmlFor="item4" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item5" />
              <label htmlFor="item5" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
          {/* List Item */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox id="item6" />
              <label htmlFor="item6" className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </label>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

export default TodoList;
