import React from 'react';
import './plan-table.style.css';
import Client from '../../models/client.model';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import VisitTaskModel from '../../models/visit-task.model';
import TablePagination from '@mui/material/TablePagination';

interface PlanTableProps {
    data: VisitTaskModel[];
    isLoading: boolean;
    onDisplayDetails: (date: Date,index:number) => {};
    selectedId: number;
    id?: string;
}

const PlanTable: React.FC<PlanTableProps> = ({ data, id, isLoading, onDisplayDetails, selectedId }) => {

    const [selectedRow, setSelectedRow] = React.useState(selectedId);

    if (selectedRow !== selectedId) {
        setSelectedRow(selectedId);
    }

    return (

        <TableContainer id={id} sx={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', }} component={Paper}>
            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ height: '45px', marginBottom: '16px', }}>
                    <TableRow >
                        <TableCell sx={{ width: '230px' }} align='left'>Date</TableCell>
                        <TableCell sx={{ width: '20%' }} align="left">wilayas</TableCell>
                        <TableCell sx={{ width: '20%' }} align="left">Visites programmes</TableCell>
                        <TableCell sx={{ width: '20%' }} align="left">visites realiser</TableCell>
                        <TableCell sx={{ width: '20%' }} align="right">Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
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
                            data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === index! ? 'cyan' : 'white' }}
                                >
                                    <TableCell sx={{ width: '250px' }} >{formatDateToYYYYMMDD(row.date || new Date())}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="left">{row.tasksWilayasCommunes?.map(twc => `(${twc})`).join(' ')}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="center">{row.numTasks}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="center">{row.numVisits}</TableCell>
                                    <TableCell sx={{ width: '20%' }} align="right">
                                        <Button onClick={() => {
                                            onDisplayDetails(row.date || new Date(),index);
                                        }} variant="text">Voir</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>


    );
};

export default PlanTable;
