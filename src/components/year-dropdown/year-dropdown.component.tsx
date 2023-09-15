import React, { useState } from 'react';
import '../year-dropdown/year-dropdown.style.css';
import Form from 'react-bootstrap/Form';

interface YearDropdownProps {
  onChange: (selectedYear: number) => void;
  style?: React.CSSProperties | undefined;
  initalYear: number;
}

const YearDropdown: React.FC<YearDropdownProps> = ({ onChange, initalYear, style }) => {
  const [selectedYear, setSelectedYear] = useState(initalYear);

  const yearOptions: JSX.Element[] = [];
  for (let year = initalYear + 10; year >= initalYear - 100; year--) {
    yearOptions.push(<option key={year} value={year.toString()}>{year}</option>);
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setSelectedYear(newYear);
    onChange(newYear);
  };

  return (
    <div style={style}>
      <Form.Select value={selectedYear} onChange={handleYearChange}
        aria-label="Default select example" size="sm"
        style={{ height: '40px', width: '150px', margin: '0px 4px' }}>
        {yearOptions}

      </Form.Select>
    </div>
  );
};

export default YearDropdown;