import React, { useState } from 'react';
import './home-table.style.css';
import VisitModel from '../../models/visit.model';
import { DotSpinner } from '@uiball/loaders'
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


interface HomeTableProps {
    data: VisitModel[];
    isLoading: boolean;
    firstHeader: string;
    onDisplayReport: (visit: VisitModel) => void;
    onDisplayCommand: (visit: VisitModel) => void;
    id?: string;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const HomeTable: React.FC<HomeTableProps> = ({ data, id, isLoading, firstHeader, onDisplayReport, onDisplayCommand, total, size, page, pageChange, }) => {

    const [rowsPerPage, setRowsPerPage] = React.useState(size);

    const [pageIndex, setPageIndex] = React.useState(page - 1);

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }

    const columns: GridColDef[] = [
        {
            field: 'username', headerName: firstHeader, width: 150,
            filterable: false,
        },
        {
            field: 'client', headerName: 'Client', width: 170,
            filterable: false,
        },
        {
            field: 'speciality', headerName: 'Spécialité', width: 130,
            filterable: false,
        },
        {
            field: 'location', headerName: 'Localisation', width: 200,
            filterable: false,
        },
        {
            field: 'report', headerName: 'Rapport', width: 80,
            filterable: false,
            renderCell(params) {
                return (<Button onClick={() => {
                    onDisplayReport(params.row);
                }} variant="text">Voir</Button>);
            },
        },
        {
            field: 'command', headerName: 'Bon de commande', width: 150,
            align: 'center',
            filterable: false,
            renderCell(params) {
                return (<Button disabled={!params.row.hasCommand} onClick={() => {
                    onDisplayCommand(params.row);
                }} variant="text">Voir</Button>);
            },
        },
    ];

    return (
        <div id={id}
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: '1',
                margin: '0px 8px 8px 8px',
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
                                    username: row.user?.username,
                                    client: row.client?.name,
                                    speciality: row.client?.speciality,
                                    location: `${row.client?.wilaya}, ${row.client?.commune}`,
                                    hasCommand: row.hasCommand,
                                    visitLocation: row.visitLocation,
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
                            <TableCell>{firstHeader}</TableCell>
                            <TableCell align="right">Client</TableCell>
                            <TableCell align="right">Specialite</TableCell>
                            <TableCell align="right">Wilaya</TableCell>
                            <TableCell align="right">Commune</TableCell>
                            <TableCell align="right">Rapport</TableCell>
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
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === row.id! ? 'cyan' : 'white' }}
                                    >
                                        <TableCell align="left">{row.user?.username}</TableCell>
                                        <TableCell align="left">{row.client?.name}</TableCell>
                                        <TableCell align="left">{row.client?.speciality}</TableCell>
                                        <TableCell align="left">{row.client?.wilaya}</TableCell>
                                        <TableCell align="left">{row.client?.commune}</TableCell>
                                        <TableCell align="left">
                                            <Button onClick={() => {
                                                setSelectedRow(row.id!);
                                                onDisplayReport(row);
                                            }} variant="text">Voir</Button>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Button disabled={!row.hasCommand} onClick={() => {
                                                setSelectedRow(row.id!);
                                                onDisplayCommand(row);
                                            }} variant="text">Voir</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            {/* <TablePagination
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

export default HomeTable;
