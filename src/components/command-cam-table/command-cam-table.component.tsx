import React from 'react';
import './command-cam-table.style.css';
import CommandModel from '../../models/command.model';
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

interface CommandCamTableProps {
    data: CommandModel[];
    displayCommand: (command: CommandModel) => {};
    id?: string;
    isLoading: boolean;
}

const CommandCamTable: React.FC<CommandCamTableProps> = ({ data, id, isLoading, displayCommand }) => {
    return (
        <TableContainer id={id} sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                    <TableRow>
                        <TableCell sx={{ width: '150px' }} >Date</TableCell>
                        <TableCell align="left">Client</TableCell>
                        <TableCell align="left">Wilaya</TableCell>
                        <TableCell align="center">Commune</TableCell>
                        <TableCell align="center">Montant</TableCell>
                        <TableCell align="center">Detail</TableCell>
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
                            data.map((row) => (
                                <TableRow
                                    key={row.id!}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ width: '150px',whiteSpace:'nowrap' }}>{formatDateToYYYYMMDD(row.visit?.createdDate || new Date())}</TableCell>
                                    <TableCell align="left">{row.visit?.client?.name}</TableCell>
                                    <TableCell align="left">{row.visit?.client?.wilaya}</TableCell>
                                    <TableCell align="left">{row.visit?.client?.commune}</TableCell>
                                    <TableCell align="left">{

                                        row.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })
                                    }</TableCell>

                                    <TableCell align="center">
                                        <Button onClick={() => {
                                            displayCommand(row);
                                        }} variant="text">Voir</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CommandCamTable;
