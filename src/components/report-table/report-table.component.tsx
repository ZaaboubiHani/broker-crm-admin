import React from 'react';
import './report-table.style.css';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import VisitModel from '../../models/visit.model';
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface ReportTableProps {
    data: VisitModel[];
    id?: string;
    isLoading: boolean;
    displayReport: (visit: VisitModel) => {};
    page: number;
    size: number;
    total: number;
    selectedId: number;
    pageChange: (page: number, size: number) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({ data, id, isLoading, displayReport, total, selectedId, size, page, pageChange, }) => {
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
            filterable: false,
        },
        {
            field: 'client', headerName: 'Client', width: 150,
            filterable: false,
        },
        {
            field: 'speciality', headerName: 'Spécialité', width: 150,
            filterable: false,
        },
        {
            field: 'location', headerName: 'Localisation', width: 200,
            filterable: false,
        },
        {
            field: 'details', headerName: 'Details', width: 80,
            renderCell(params) {
                return (<Button onClick={() => {
                    displayReport(params.row);
                }} variant="text">Voir</Button>);
            },
            filterable: false,
        },
    ];

    return (
        <div id={id}  style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            margin: '0px 8px 8px 8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.5)'
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
                                    speciality: row.client?.speciality,
                                    location: `${row.client?.wilaya}, ${row.client?.commune}`,
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
                            <TableCell >Date</TableCell>
                            <TableCell align="left">Client</TableCell>
                            <TableCell align="left">Wilaya</TableCell>
                            <TableCell align="center">Commune</TableCell>
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
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === row.id! ? 'cyan' : 'white' }}
                                    >
                                        <TableCell>{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                        <TableCell align="left">{row.client?.name}</TableCell>
                                        <TableCell align="left">{row.client?.wilaya}</TableCell>
                                        <TableCell align="left">{row.client?.commune}</TableCell>

                                        <TableCell align="center">
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
            /> */}
        </div>
    );
};

export default ReportTable;
