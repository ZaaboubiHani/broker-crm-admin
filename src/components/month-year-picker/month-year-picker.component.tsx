import React, { useState, useEffect } from 'react';
import DayPicker from '../day-picker/day-picker.component';
import MonthDropdown from '../month-dropdown/month-dropdown.component';
import YearDropdown from '../year-dropdown/year-dropdown.component';
import UserPicker from '../user-picker/user-picker.component';


interface MonthYearPickerProps {
  onPick: (date: Date) => void;
  initialDate?: Date;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ onPick, initialDate }) => {
  const [date, setDate] = useState(initialDate || new Date());
  const [rebuildDayTrigger, setRebuildDayTrigger] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const handleMonthSelect = (value: number) => {
    const selectedMonth = new Date(date.getFullYear(), value - 1, date.getDate());
    setDate(selectedMonth);
    setRebuildDayTrigger(!rebuildDayTrigger);
    onPick(selectedMonth);
  };

  const handleYearSelect = (value: number) => {
    const selectedYear = new Date(value, date.getMonth(), date.getDate());
    setDate(selectedYear);
    setRebuildDayTrigger(!rebuildDayTrigger);
    onPick(selectedYear);
  };

  return (

    <div style={{ height: 60,  display: 'flex', alignItems: 'stretch' }}>
      <UserPicker onSelect={() => { }} delegates={[]}></UserPicker>
      <MonthDropdown onChange={(month) => {
        handleMonthSelect(month);
      }}></MonthDropdown>
      <YearDropdown onChange={(year) => {
        handleYearSelect(year);
      }}></YearDropdown>

    </div>
  );
};

export default MonthYearPicker;
