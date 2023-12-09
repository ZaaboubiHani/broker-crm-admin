import React, { useState } from 'react';
import '../month-dropdown/month-dropdown.style.css';
import { PRIMARY_COLOR, PRIMARY_COLOR_HIGHLIGHT } from '../../theme';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
          value={selectedMonth}
          onChange={(event) => {
            const selectedValue = parseInt(event.target.value.toString());
            setSelectedMonth(selectedValue);
            onChange(selectedValue);
          }}
        >
          {
            months.map((month, index) => (
              <MenuItem value={index + 1}>{month}</MenuItem>
            ))
          }

        </Select>
      </FormControl>
    </div>
  );
};

export default MonthDropdown;
