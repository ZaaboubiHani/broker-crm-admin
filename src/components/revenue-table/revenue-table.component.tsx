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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface RevenueTableProps {
    data: RevenueModel[];
    displayDetails: (delegateId: number) => {};
    id?: string;
    isLoading: boolean;
}

const RevenueTable: React.FC<RevenueTableProps> = ({ data, id, isLoading, displayDetails }) => {


    const columns: GridColDef[] = [
        { field: 'class', headerName: 'Classement', width: 100 },
        { field: 'delegateName', headerName: 'Délégué', width: 150 },
        { field: 'amount', headerName: 'Chiffre d\'affaire', width: 150 },
        { field: 'percentage', headerName: 'Pourcentage', width: 150 },
        {
            field: 'details', headerName: 'Details', width: 100,
            renderCell: (params) => {
                return (<Button onClick={() => {
                    displayDetails(params.row.delegateId!);
                }} variant="text">Voir</Button>);
            }
        },


    ];


    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', margin: '8px 8px 8px 16px',borderRadius:'8px',backgroundColor:'rgba(255,255,255,0.5)' }}>
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
                    (<DataGrid

                        rows={
                            [...data.map((row, index) => {

                                return {
                                    id: index,
                                    class: index + 1,
                                    delegateId: row.delegateId,
                                    delegateName: row.delegateName,
                                    percentage: row.percentage,
                                    amount: row.amount?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),

                                };
                            })]}
                        columns={columns}
                        hideFooterPagination={true}
                        hideFooter={true}
                        checkboxSelection={false}
                        hideFooterSelectedRowCount={true}
                    />)}
        </div>
        // <TableContainer id={id} sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
        //     <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
        //         <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
        //             <TableRow>
        //                 <TableCell sx={{ width: '20%' }}>Classement</TableCell>
        //                 <TableCell sx={{ width: '25%' }} align="left">Delegue</TableCell>
        //                 <TableCell sx={{ width: '25%' }} align="left">Chiffre d'affaire</TableCell>
        //                 <TableCell sx={{ width: '25%' }} align="left">Pourcentage</TableCell>
        //                 <TableCell sx={{ width: '25%' }} align="center">Details</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
        //             {
        //                 isLoading ? (<div style={{
        //                     width: '100%',
        //                     flexGrow: '1',
        //                     overflow: 'hidden',
        //                     height: '100%',
        //                     display: 'flex',
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                 }}>
        //                     <DotSpinner
        //                         size={40}
        //                         speed={0.9}
        //                         color="black"
        //                     />
        //                 </div>) :
        //                     data.map((row, index) => (
        //                         <TableRow
        //                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        //                         >
        //                             <TableCell sx={{ width: '20%', whiteSpace: 'nowrap' }} align="center">{index + 1}</TableCell>
        //                             <TableCell sx={{ width: '25%' }} align="left">{row.delegateName}</TableCell>
        //                             <TableCell sx={{ width: '25%' }} align="left">{row.amount?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
        //                             <TableCell sx={{ width: '25%' }} align="left">{row.percentage}</TableCell>
        //                             <TableCell sx={{ width: '25%' }} align="center">
        //                                 <Button onClick={() => {
        //                                     displayDetails(row.delegateId!);
        //                                 }} variant="text">Voir</Button>
        //                             </TableCell>
        //                         </TableRow>
        //                     ))}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
    );
};

export default RevenueTable;
