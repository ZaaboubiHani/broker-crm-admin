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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface ClientsPharmacyTableProps {
    data: VisitModel[];
    displayCommand: (visit: VisitModel) => {};
    displayReport: (visit: VisitModel) => {};
    pageChange: (page: number, size: number) => void;
    id?: string;
    page: number;
    size: number;
    total: number;
    isLoading: boolean;
}

const ClientsPharmacyTable: React.FC<ClientsPharmacyTableProps> = ({ total, size, page, pageChange, data, id, isLoading, displayCommand, displayReport }) => {
    const [rowsPerPage, setRowsPerPage] = React.useState(size);
    const [pageIndex, setPageIndex] = React.useState(page - 1);

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }


    const columns: GridColDef[] = [
        {
            field: 'date', headerName: 'Date', width: 150, valueFormatter(params) {
                return formatDateToYYYYMMDD(params.value);
            },
        },
        { field: 'client', headerName: 'Client', width: 150 },
        { field: 'delegate', headerName: 'Délégué', width: 150 },
        { field: 'location', headerName: 'Localisation', minWidth: 150, maxWidth: 200 },
        {
            field: 'report', headerName: 'Rapport', width: 80,
            renderCell(params) {
                return (<Button onClick={() => {
                    displayReport(params.row);
                }} variant="text">Voir</Button>);
            },
        },
        {
            field: 'command', headerName: 'Bon de commande', width: 80,
            renderCell(params) {
                return (<Button disabled={!params.row.hasCommand} onClick={() => {
                    displayCommand(params.row);
                }} variant="text">Voir</Button>);
            },
        },
    ];


    return (

        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            marginBottom: '8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.5)',
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
                    (<DataGrid

                        rows={
                            [...Array.from({ length: rowsPerPage * pageIndex }, (_, index) => {
                                return { id: index };
                            }), ...data.map((row) => {
                                return {
                                    id: row.id,
                                    date: row.createdDate || new Date(),
                                    client: row.client?.name,
                                    delegate: row.user?.username,
                                    location: `${row.client?.wilaya}, ${row.client?.commune}`,
                                    visitLocation: row.visitLocation,
                                    hasCommand: row.hasCommand,
                                };
                            })]}
                        columns={columns}
                        rowCount={total}
                        onPaginationModelChange={(model) => {
                            setPageIndex(model.page);
                            pageChange(model.page + 1, model.pageSize);
                            setRowsPerPage(model.pageSize);

                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: rowsPerPage,
                                    page: pageIndex,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        checkboxSelection={false}
                        hideFooterSelectedRowCount={true}
                    />)}
            {/* <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
                <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                    <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                        <TableRow>
                            <TableCell sx={{ wdith: '150px' }}>Date</TableCell>
                            <TableCell align="left">Client</TableCell>
                            <TableCell align="left">Délégué</TableCell>
                            <TableCell align="left">Wilaya</TableCell>
                            <TableCell align="center">Commune</TableCell>
                            <TableCell align="center">Rapport</TableCell>
                            <TableCell align="center">Bon de commande</TableCell>
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
                                        <TableCell sx={{ wdith: '150px', whiteSpace: 'nowrap' }}>{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                        <TableCell align="left">{row.client?.name}</TableCell>
                                        <TableCell align="left">{row.user?.username}</TableCell>
                                        <TableCell align="left">{row.client?.wilaya}</TableCell>
                                        <TableCell align="left">{row.client?.commune}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => {
                                                displayReport(row);
                                            }} variant="text">Voir</Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button disabled={!row.hasCommand} onClick={() => {
                                                displayCommand(row);
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
            /> */}
        </div>

    );
};

export default ClientsPharmacyTable;
