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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ScalableTable from '../scalable-table/scalable-table.component';


export interface ExpenseTableProps {
    data: ExpenseModel[];
    isLoading: boolean;

}


const ExpenseTable: React.FC<ExpenseTableProps> = ({ data, isLoading }) => {


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: '8px',
        }}>
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
                    (<ScalableTable

                        rows={
                            [...data.map((row, index) => {
                                return {
                                    id: index,
                                    date: row.createdDate || new Date(),
                                    startLocation: `${row.startCommun ?? ''}, ${row.startWilaya ?? ''}`,
                                    endLocation: `${row.endCommun ?? ''}, ${row.endWilaya ?? ''}`,
                                    totalVisitsDoctor: row.totalVisitsDoctor,
                                    totalVisitsPharmacy: row.totalVisitsPharmacy,
                                    kmTotal: row.kmTotal,
                                    indemnityKm: row.indemnityKm,
                                    nightsTotal: row.nightsTotal,
                                    indemnityNights: row.indemnityNights,
                                    otherExpenses: row.otherExpenses,
                                    totalExpense: row.totalExpense,
                                };
                            })]}
                        columns={[
                            {
                                field: 'date',
                                headerName: 'Date',
                                valueFormatter(params) {
                                    return formatDateToYYYYMMDD(params.value);
                                },
                            },
                            {
                                field: 'startLocation',
                                headerName: 'Localité départ',

                            },
                            {
                                field: 'endLocation',
                                headerName: 'Localité arrivé',
                            },
                            {
                                field: 'totalVisitsDoctor',
                                headerName: 'Total contact médcins',
                            },
                            {
                                field: 'totalVisitsPharmacy',
                                headerName: 'Total contact pharmacies',
                            },
                            {
                                field: 'kmTotal',
                                headerName: 'Total KM',
                            },
                            {
                                field: 'indemnityKm',
                                headerName: 'Indemnités KM',
                                valueFormatter(params) {
                                    return params.value.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' });
                                },
                            },
                            {
                                field: 'nightsTotal',
                                headerName: 'Total nuites',
                            },
                            {
                                field: 'indemnityNights',
                                headerName: 'Indemnités nuites',
                                valueFormatter(params) {
                                    return params.value.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' });
                                },
                            },
                            {
                                field: 'otherExpenses',
                                headerName: 'Autre frais',
                                valueFormatter(params) {
                                    return params.value.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' });
                                },
                            },
                            {
                                field: 'totalExpense',
                                headerName: 'Total des indemnités',
                                valueFormatter(params) {
                                    return params.value.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' });
                                },
                            },
                        ]}
                        hidePaginationFooter={true}
                    />)}
        </div>
    );
};

export default ExpenseTable;
