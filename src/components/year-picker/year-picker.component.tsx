import React, { useState, useEffect } from 'react';
import DayPicker from '../day-picker/day-picker.component';
import MonthDropdown from '../month-dropdown/month-dropdown.component';
import YearDropdown from '../year-dropdown/year-dropdown.component';
import UserPicker from '../user-picker/user-picker.component';


interface YearPickerProps {
  onPick: (date: Date) => void;
  initialDate?: Date;
}

const YearPicker: React.FC<YearPickerProps> = ({ onPick, initialDate }) => {
  const [date, setDate] = useState(initialDate || new Date());
  const [rebuildDayTrigger, setRebuildDayTrigger] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);


  const handleYearSelect = (value: number) => {
    const selectedYear = new Date(value, date.getMonth(), date.getDate());
    setDate(selectedYear);
    setRebuildDayTrigger(!rebuildDayTrigger);
    onPick(selectedYear);
  };

  return (

    <div style={{ height: 60,  display: 'flex', alignItems: 'stretch' }}>
      <UserPicker onSelect={() => { }} delegates={[]}></UserPicker>
     
      <YearDropdown initalYear={date.getFullYear()} onChange={(year) => {
        handleYearSelect(year);
      }}></YearDropdown>

    </div>
  );
};

export default YearPicker;
