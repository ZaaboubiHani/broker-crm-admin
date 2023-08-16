import React, { useState, useEffect } from 'react';
import DayPicker from '../day-picker/day-picker.component';
import MonthDropdown from '../month-dropdown/month-dropdown.component';
import YearDropdown from '../year-dropdown/year-dropdown.component';
import ClientPicker from '../client-picker/client-picker.component';


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

    <div style={{ height: 80, display: 'flex', alignItems: 'stretch' }}>
      <ClientPicker onSelect={() => { }} clients={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]}></ClientPicker>
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
