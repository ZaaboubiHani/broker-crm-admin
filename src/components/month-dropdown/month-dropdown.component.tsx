import React, { useState } from 'react';
import '../month-dropdown/month-dropdown.style.css';
interface MonthDropdownProps {
  onChange: (selectedMonth: number) => void;
}

const MonthDropdown: React.FC<MonthDropdownProps> = ({ onChange }) => {
  const months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentMonth = new Date().getMonth()+1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedMonth(selectedValue);
    onChange(selectedValue);
  };

  return (
    <select value={selectedMonth} onChange={handleMonthChange} className='month-dropdown'>
     
      {months.map((month, index) => (
        <option key={index} value={index + 1}>{month}</option>
      ))}
    </select>
  );
};

export default MonthDropdown;
