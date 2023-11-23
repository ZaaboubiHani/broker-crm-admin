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
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface CommandCamTableProps {
    data: CommandModel[];
    displayCommand: (command: CommandModel) => {};
    id?: string;
    isLoading: boolean;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const CommandCamTable: React.FC<CommandCamTableProps> = ({ data, id, isLoading, displayCommand, total, size, page, pageChange, }) => {

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
        { field: 'wilaya', headerName: 'Wilaya', width: 150 },
        { field: 'commune', headerName: 'Commune', width: 150, },
        { field: 'amount', headerName: 'Montant', width: 150, },
        {
            field: 'details', headerName: 'Details', width: 80,
            renderCell(params) {
                return (<Button onClick={() => {
                    displayCommand(params.row.command);
                }} variant="text">Voir</Button>);
            },
        },
    ];

    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', marginRight: '16px' }}>

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
                                    date: row.visit?.createdDate || new Date(),
                                    client: row.visit?.client?.name,
                                    amount: row.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),
                                    wilaya: row.visit?.client?.wilaya,
                                    commune: row.visit?.client?.commune,
                                    command: row,
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

                    />)}
            {/* <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
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
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } , backgroundColor: selectedRow === row.id! ? 'cyan' : 'white'}}
                                    >
                                        <TableCell sx={{ width: '150px', whiteSpace: 'nowrap' }}>{formatDateToYYYYMMDD(row.visit?.createdDate || new Date())}</TableCell>
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

export default CommandCamTable;
