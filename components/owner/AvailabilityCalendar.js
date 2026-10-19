
"use client";

import { useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AvailabilityCalendar({
  availability = [],
  selectedDate,
  onDateSelect,
  visibleMonth,
  onMonthChange,
  loading = false,
}) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [year, month]);

  const availabilityByDate = useMemo(() => {
    const map = new Map();

    for (const item of availability) {
      if (!item?.date) continue;

      // ISO date ko UTC se local date mein shift hone se bachao.
      const date =
        typeof item.date === "string"
          ? item.date.slice(0, 10)
          : toDateKey(new Date(item.date));

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

      const total = Number(item.totalRooms) || 0;
      const booked = Number(item.bookedRooms) || 0;
      const blocked = Number(item.blockedRooms) || 0;

      map.set(date, {
        availableRooms: Math.max(0, total - booked - blocked),
        totalRooms: total,
        bookedRooms: booked,
        blockedRooms: blocked,
        closed: item.isClosed === true,
        price: Number(item.price) || 0,
        found: true,
      });
    }

    return map;
  }, [availability]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#172033]">
            <CalendarDays size={20} className="text-[#B96928]" />
            Availability Calendar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a date to manage room inventory and price.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onMonthChange(-1)}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={19} />
          </button>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => onMonthChange(1)}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      <div className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold text-[#172033]">
          {visibleMonth.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        {loading && (
          <span className="text-xs font-semibold text-gray-500">
            Loading availability...
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center sm:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-[11px] font-bold text-gray-400 sm:text-xs"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;

          const date = toDateKey(new Date(year, month, day));
          const record = availabilityByDate.get(date);
          const isSelected = selectedDate === date;

          let statusClass =
            "border-gray-100 bg-white text-gray-700 hover:border-[#B96928]";

          if (record?.closed) {
            statusClass = "border-red-200 bg-red-50 text-red-700";
          } else if (record?.found && record.availableRooms > 0) {
            statusClass =
              "border-emerald-200 bg-emerald-50 text-emerald-700";
          } else if (record?.found) {
            statusClass = "border-amber-200 bg-amber-50 text-amber-700";
          }

          return (
            <button
              key={date}
              type="button"
              disabled={loading}
              onClick={() => onDateSelect(date)}
              title={
                record?.closed
                  ? "Closed"
                  : record?.found
                  ? `${record.availableRooms} rooms available`
                  : "No saved availability record"
              }
              className={`flex min-h-12 flex-col items-center justify-center rounded-xl border text-sm font-bold transition disabled:cursor-wait disabled:opacity-60 sm:min-h-14 ${statusClass} ${
                isSelected
                  ? "ring-2 ring-[#B96928] ring-offset-1"
                  : ""
              }`}
            >
              <span>{day}</span>

              {record?.found && (
                <span className="mt-1 text-[9px] font-semibold sm:text-[10px]">
                  {record.closed
                    ? "Closed"
                    : `${record.availableRooms} left`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-gray-100 pt-5 text-xs text-gray-600">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          No rooms available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Closed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          No saved record
        </span>
      </div>
    </section>
  );
}
