import React from 'react';
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
import RevenueModel from '../../models/revenue.model';

interface RevenueTableProps {
    data: RevenueModel[];
    displayDetails: (delegateId: number) => {};
    id?: string;
    isLoading: boolean;
}

const RevenueTable: React.FC<RevenueTableProps> = ({ data, id, isLoading, displayDetails }) => {
    return (
        <TableContainer id={id} sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                    <TableRow>
                        <TableCell sx={{width:'20%'}}>Classement</TableCell>
                        <TableCell sx={{width:'25%'}} align="left">Delegue</TableCell>
                        <TableCell sx={{width:'25%'}} align="left">Chiffre d'affaire</TableCell>
                        <TableCell sx={{width:'25%'}} align="left">Pourcentage</TableCell>
                        <TableCell sx={{width:'25%'}} align="center">Details</TableCell>
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
                            data.map((row,index) => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{width:'20%',whiteSpace:'nowrap'}} align="center">{index+1}</TableCell>
                                    <TableCell sx={{width:'25%'}} align="left">{row.delegateName}</TableCell>
                                    <TableCell sx={{width:'25%'}} align="left">{row.amount?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                    <TableCell sx={{width:'25%'}} align="left">{row.percentage}</TableCell>
                                    <TableCell sx={{width:'25%'}} align="center">
                                        <Button onClick={() => {
                                            displayDetails(row.delegateId!);
                                        }} variant="text">Voir</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RevenueTable;
