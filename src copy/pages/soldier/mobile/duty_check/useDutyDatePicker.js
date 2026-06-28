import { useMemo, useState } from "react";

const DEFAULT_YEAR = 2026;
const DEFAULT_MONTH = 6;
const DEFAULT_DAY = 27;

function padDate(value) {
  return String(value).padStart(2, "0");
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function useDutyDatePicker({
  year = DEFAULT_YEAR,
  initialMonth = DEFAULT_MONTH,
  initialDay = DEFAULT_DAY,
} = {}) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [openPicker, setOpenPicker] = useState(null);

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );

  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, selectedMonth);
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, year]);

  const dateValue = `${year}-${padDate(selectedMonth)}-${padDate(selectedDay)}`;
  const displayDate = `${year}.${padDate(selectedMonth)}.${padDate(selectedDay)}`;

  const togglePicker = (pickerName) => {
    setOpenPicker((currentPicker) => (currentPicker === pickerName ? null : pickerName));
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setSelectedDay((day) => Math.min(day, getDaysInMonth(year, month)));
    setOpenPicker(null);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setOpenPicker(null);
  };

  return {
    selectedMonth,
    selectedDay,
    openPicker,
    monthOptions,
    dayOptions,
    dateValue,
    displayDate,
    togglePicker,
    handleMonthSelect,
    handleDaySelect,
  };
}