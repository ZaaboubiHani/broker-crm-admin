import React, { useState } from 'react';
import '../month-dropdown/month-dropdown.style.css';
import Form from 'react-bootstrap/Form';

interface MonthDropdownProps {
  onChange: (selectedMonth: number) => void;
  style?: React.CSSProperties;
}

const MonthDropdown: React.FC<MonthDropdownProps> = ({ onChange, style }) => {
  const months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedMonth(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div style={style}>

      <Form.Select
        value={selectedMonth}
        onChange={handleMonthChange}
        aria-label="Default select example" size="sm"
        style={{ height: '40px', width: '150px', margin: '0px 4px' }}>
        {months.map((month, index) => (
          <option key={index} value={index + 1}>{month}</option>
        ))}

      </Form.Select>

    </div>
  );
};

export default MonthDropdown;
