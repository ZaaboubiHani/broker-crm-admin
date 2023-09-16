import React from 'react';
import './delegate-table.style.css';
import VisitModel from '../../models/visit.model';
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

interface DelegateTableProps {
    data: VisitModel[];
    onDisplayReport: (visit: VisitModel) => void;
    onDisplayCommand: (visit: VisitModel) => void;
    isLoading: boolean;
    id?: string;
}

const DelegateTable: React.FC<DelegateTableProps> = ({ data, id, onDisplayCommand, onDisplayReport, isLoading }) => {
    return (
        <TableContainer id={id} sx={{  display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden',}} component={Paper}>
            <Table sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                    <TableRow>
                        <TableCell style={{ width: '165px' }}>Date</TableCell>
                        <TableCell align="left">Client</TableCell>
                        <TableCell align="left">Specialite</TableCell>
                        <TableCell align="left">Wilaya</TableCell>
                        <TableCell align="left">Commune</TableCell>
                        <TableCell align="right">Rapport</TableCell>
                        <TableCell align="center">Bon de commande</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ overflowY: 'auto', overflowX: 'hidden', }}>
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
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell style={{ width: '140px',  whiteSpace: 'nowrap', }}>{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                    <TableCell align="left" style={{
                                        display:'block',
                                        width: '100px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        margin:'0px',
                                        padding:'15px 0px',
                                    }} >{row.client?.name}</TableCell>
                                    <TableCell align="left">{row.client?.speciality}</TableCell>
                                    <TableCell align="left">{row.client?.wilaya}</TableCell>
                                    <TableCell align="left">{row.client?.commune}</TableCell>
                                    <TableCell align="left">
                                        <Button onClick={() => {
                                            onDisplayReport(row);
                                        }} variant="text">Voir</Button>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Button disabled={!row.hasCommand} onClick={() => {
                                            onDisplayCommand(row);
                                        }} variant="text">Voir</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DelegateTable;
