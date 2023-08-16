import React, { useState } from 'react';
import '../year-dropdown/year-dropdown.style.css';

interface YearDropdownProps {
    onChange: (selectedYear: number) => void;
  }
  
  const YearDropdown: React.FC<YearDropdownProps> = ({ onChange }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
  
    const yearOptions: JSX.Element[] = [];
    for (let year = currentYear+10; year >= currentYear - 100; year--) {
      yearOptions.push(<option key={year} value={year.toString()}>{year}</option>);
    }
  
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(event.target.value);
      setSelectedYear(newYear);
      onChange(newYear);
    };
  
    return (
      <select value={selectedYear} onChange={handleYearChange} className='year-dropdown'>
        {yearOptions}
      </select>
    );
  };
  
  export default YearDropdown;