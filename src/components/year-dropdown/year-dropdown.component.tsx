import React, { useState } from 'react';
import '../year-dropdown/year-dropdown.style.css';
import { PRIMARY_COLOR, PRIMARY_COLOR_HIGHLIGHT } from '../../theme';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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


  return (
    <div style={style}>
      <FormControl sx={{
        height: '40px',
        width: '150px',
        backgroundColor: 'white',
      }}>

        <Select
          sx={{
            height: '40px',
            width: '150px',
            backgroundColor: 'white',
          }}
          value={selectedYear}
          onChange={(event) => {
            const newYear = parseInt(event.target.value.toString());
            setSelectedYear(newYear);
            onChange(newYear);
          }}
        >
          {
            yearOptions
          }

        </Select>
      </FormControl>
      
    </div>
  );
};

export default YearDropdown;