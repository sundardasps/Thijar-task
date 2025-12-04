import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { BORDER, INPUT_STYLE } from "../../styles/constents";

export const DateBox = forwardRef(
  (
    {
      defaultValue = "",
      value: controlledValue,
      onChange,
      className = "",
      placeholder = "DD/MM/YYYY",
    },
    forwardedRef
  ) => {
    const rootRef = useRef(null);
    const popupRef = useRef(null);

    // expose ref to parent if forwarded
    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(rootRef.current);
      else forwardedRef.current = rootRef.current;
    }, [forwardedRef]);

    // internal state (uncontrolled if no controlledValue)
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    const [display, setDisplay] = useState(
      currentValue ? formatToDisplay(currentValue) : ""
    );
    useEffect(() => {
      setDisplay(currentValue ? formatToDisplay(currentValue) : "");
    }, [currentValue]);

    // popup & calendar state
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
      // base month to show in calendar (YYYY-MM-DD) -> use currentValue or today
      const base = currentValue || isoToday();
      const [y, m] = base.split("-");
      return new Date(Number(y), Number(m) - 1, 1);
    });

    useEffect(() => {
      // if controlled value changes, update viewDate to that month
      if (currentValue) {
        const [y, m] = currentValue.split("-");
        setViewDate(new Date(Number(y), Number(m) - 1, 1));
      }
    }, [currentValue]);

    // close on outside click
    useEffect(() => {
      function onDoc(e) {
        if (!rootRef.current) return;
        if (rootRef.current.contains(e.target)) return;
        setOpen(false);
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // close on Esc
    useEffect(() => {
      function onKey(e) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, []);

    function isoToday() {
      const d = new Date();
      return toIso(d);
    }

    function toIso(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    function formatToDisplay(iso) {
      if (!iso) return "";
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    }

    function handleSelectDay(day) {
      // day is a Date
      const iso = toIso(day);
      // update uncontrolled or rely on parent controlled prop
      if (controlledValue === undefined) setInternalValue(iso);
      setDisplay(formatToDisplay(iso));
      setOpen(false);

      // emit synthetic event for compatibility
      if (typeof onChange === "function") {
        onChange({ target: { value: iso } });
      }
    }

    // calendar generation
    function getCalendarMatrix(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const startWeekday = firstDay.getDay(); // 0 (Sun) - 6
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // build array of Date objects, includes previous month days to align
      const matrix = [];
      // determine how many days from prev month to show (we'll show starting Sunday)
      const prevMonthDays = startWeekday; // number of placeholders before 1st

      // find last day of previous month
      const prevMonthLast = new Date(year, month, 0).getDate();

      // build 6 rows of 7 columns
      let cur = 1;
      for (let week = 0; week < 6; week++) {
        const row = [];
        for (let weekday = 0; weekday < 7; weekday++) {
          const cellIndex = week * 7 + weekday;
          const dayNum = cellIndex - prevMonthDays + 1;
          if (dayNum <= 0) {
            // prev month day
            row.push(new Date(year, month - 1, prevMonthLast + dayNum));
          } else if (dayNum > daysInMonth) {
            // next month day
            row.push(new Date(year, month + 1, dayNum - daysInMonth));
          } else {
            row.push(new Date(year, month, dayNum));
          }
        }
        matrix.push(row);
      }
      return matrix;
    }

    // helpers to compare dates (ignoring time)
    function isSameDay(a, b) {
      if (!a || !b) return false;
      return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
      );
    }

    // UI actions
    function prevMonth() {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
    function nextMonth() {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

    // derive selectedDate object
    const selectedDate = currentValue
      ? new Date(
          ...currentValue
            .split("-")
            .map((x, i) => (i === 0 ? Number(x) : Number(x)))
        )
      : null;
    // better: parse properly:
    const selected = currentValue
      ? (() => {
          const [y, m, d] = currentValue.split("-");
          return new Date(Number(y), Number(m) - 1, Number(d));
        })()
      : null;

    const matrix = getCalendarMatrix(viewDate);
    const monthName = viewDate.toLocaleString(undefined, { month: "long" });
    const yearNum = viewDate.getFullYear();

    return (
      <div ref={rootRef} className={`relative  h-min  ${className}`}>
        <div
          className={` flex items-center gap-5 ${INPUT_STYLE}  rounded-md    text-black cursor-pointer `}
          onClick={() => setOpen((v) => !v)}
        >
          <Calendar size={18} className="text-gray-700" />
          <span className={`select-none ${display ? "" : "text-gray-400"}`}>
            {display || placeholder}
          </span>
        </div>

        {open && (
          <div
            ref={popupRef}
            className="absolute z-50 mt-2 bg-white border rounded shadow-lg p-3 w-[280px]"
          >
            {/* header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  type="button"
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="font-medium">
                  {monthName} {yearNum}
                </div>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setInternalValue("");
                    setDisplay("");
                    onChange?.({ target: { value: "" } });
                  }}
                  type="button"
                  className="text-sm text-red-500"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* days */}
            <div className="grid grid-cols-7 gap-1">
              {matrix.map((row, rIdx) =>
                row.map((day, cIdx) => {
                  const isCurrMonth = day.getMonth() === viewDate.getMonth();
                  const isSel = selected && isSameDay(day, selected);
                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`
                    p-1 rounded w-full h-8 flex items-center justify-center text-sm
                    ${isCurrMonth ? "text-gray-800" : "text-gray-400"}
                    ${isSel ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
                  `}
                    >
                      {day.getDate()}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
