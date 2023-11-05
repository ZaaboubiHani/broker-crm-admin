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
import VisitModel from '../../models/visit.model';
import TablePagination from '@mui/material/TablePagination';

interface ClientsDoctorTableProps {
    data: VisitModel[];
    displayReport: (visit: VisitModel) => {};
    id?: string;
    pageChange: (page: number) => void;
    rowNumChange: (rowNum: number) => void;
    page: number;
    size: number;
    total: number;
    isLoading: boolean;
}

const ClientsDoctorTable: React.FC<ClientsDoctorTableProps> = ({ total, size, page, rowNumChange, pageChange, data, id, isLoading, displayReport }) => {

    const [rowsPerPage, setRowsPerPage] = React.useState(size);
    const [pageIndex, setPageIndex] = React.useState(page - 1);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPageIndex(newPage);
        pageChange(newPage + 1);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageIndex(0);
        rowNumChange(parseInt(event.target.value, 10));
    };

    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', marginRight: '16px' }}>
            <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', height: 'calc(100% -400px)' }} component={Paper}>
                <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                    <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                        <TableRow>
                            <TableCell sx={{ width: '10%', }}>Date</TableCell>
                            <TableCell sx={{ width: '20%', }} align="left">Client</TableCell>
                            <TableCell sx={{ width: '20%', }} align="left">Délégué</TableCell>
                            <TableCell sx={{ width: '20%', }} align="left">Spécialité</TableCell>
                            <TableCell sx={{ width: '20%', }} align="left">Wilaya</TableCell>
                            <TableCell sx={{ width: '20%', }} align="left">Commune</TableCell>
                            <TableCell sx={{ width: '10px' }} align="center">Rapport</TableCell>
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
                                        <TableCell sx={{ width: '10%', whiteSpace: 'nowrap' }} >{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                        <TableCell sx={{ width: '20%', textOverflow: 'ellipsis' }} align="left">{row.client?.name}</TableCell>
                                        <TableCell sx={{ width: '20%', textOverflow: 'ellipsis' }} align="left">{row.user?.username}</TableCell>
                                        <TableCell sx={{ width: '20%', textOverflow: 'ellipsis' }} align="left">{row.client?.speciality}</TableCell>
                                        <TableCell sx={{ width: '20%', textOverflow: 'ellipsis' }} align="left">{row.client?.wilaya}</TableCell>
                                        <TableCell sx={{ width: '2px', textOverflow: 'ellipsis' }} align="left">{row.client?.commune}</TableCell>
                                        <TableCell sx={{ width: '150px' }} align="center">
                                            <Button onClick={() => {
                                                displayReport(row);
                                            }} variant="text">Voir</Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ minHeight: '50px', overflow: 'hidden' }}
                labelRowsPerPage='Lignes par page'
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ClientsDoctorTable;
