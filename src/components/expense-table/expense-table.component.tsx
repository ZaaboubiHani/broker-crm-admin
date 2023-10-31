import React from 'react';
import './expense-table.style.css';
import TableContainer from '@mui/material/TableContainer';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UserModel from '../../models/user.model';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { DotSpinner } from '@uiball/loaders';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Input from '@mui/material/Input';
import ExpenseModel from '../../models/expense.model';


export interface ExpenseTableProps {
    data: ExpenseModel[];
    isLoading: boolean;

}


const ExpenseTable: React.FC<ExpenseTableProps> = ({ data, isLoading }) => {
    return (
        <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', }} component={Paper}>
            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ display: 'flex', justifyContent: 'stretch', alignItems: 'stretch', height: '65px', width: "100%" }}>
                    <TableRow sx={{ flexGrow: '1' }}>
                        <TableCell align='left'>Date</TableCell>
                        <TableCell align='left'>Localité départ</TableCell>
                        <TableCell align='left'>Localité arrivé</TableCell>
                        <TableCell align="left">Total contact médcins</TableCell>
                        <TableCell align="left">Total contact pharmacies</TableCell>
                        <TableCell align="left">Total KM</TableCell>
                        <TableCell align="left">Indemnités KM</TableCell>
                        <TableCell align="left">Total nuites</TableCell>
                        <TableCell align="left">Indemnités nuites</TableCell>
                        <TableCell align="left">autre frais</TableCell>
                        <TableCell align="left">Total des indemnités</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ flexGrow: '1', height: "1px" }}>
                    {
                        isLoading ? (<div style={{
                            width: '100%',
                            flexGrow: '1',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <DotSpinner
                                size={40}
                                speed={0.9}
                                color="black"
                            />
                        </div>) :
                            data.map((row) => (
                                <TableRow
                                    key={row.id!}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, flexGrow: '1', width: '100%' }}
                                >
                                    <TableCell sx={{ whiteSpace: 'nowrap', width: '10px' }} >{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                    <TableCell sx={{ width: '10px' }} align="left">{row.startLocation}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.endLocation}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="center">{row.totalVisitsDoctor}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="center">{row.totalVisitsPharmacy}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="center">{row.kmTotal}km</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.indemnityKm?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.nightsTotal}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.indemnityNights?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.otherExpenses?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.totalExpense?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default ExpenseTable;
