import React from 'react';
import './delegate-table.style.css';
import VisitModel from '../../models/visit.model';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface DelegateTableProps {
    data: VisitModel[];
    onDisplayReport: (visit: VisitModel) => void;
    onDisplayCommand: (visit: VisitModel) => void;
    isLoading: boolean;
    id?: string;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
    // rowNumChange: (rowNum: number) => void;
}

const DelegateTable: React.FC<DelegateTableProps> = ({ data, id, onDisplayCommand, onDisplayReport, isLoading, total, size, page, pageChange, }) => {
    const [rowsPerPage, setRowsPerPage] = React.useState(size);


    const [pageIndex, setPageIndex] = React.useState(page - 1);



    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }
    // const handleChangePage = (event: unknown, newPage: number) => {
    //     setPageIndex(newPage);
    //     pageChange(newPage + 1);
    //     setSelectedRow(-1);
    // };
    // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPageIndex(0);
    //     setSelectedRow(-1);
    //     rowNumChange(parseInt(event.target.value, 10));
    // };
    const columns: GridColDef[] = [

        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'client', headerName: 'Client', width: 200 },
        { field: 'speciality', headerName: 'Spécialité', width: 130 },
        { field: 'location', headerName: 'Localisation', width: 200 },
        {
            field: 'report', headerName: 'Rapport', width: 80,

            renderCell(params) {
                return (<Button onClick={() => {
                    onDisplayReport(params.row);
                }} variant="text">Voir</Button>);
            },

        },
        {
            field: 'command',
            headerName: 'Bon de commande',
            width: 150,
            align: 'center',
            renderCell(params) {
                return (<Button disabled={!params.row.hasCommand} onClick={() => {
                    onDisplayCommand(params.row);
                }} variant="text">Voir</Button>);
            },

        },


    ];
    return (
        <div id={id} style={{
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
                                    date: formatDateToYYYYMMDD(row.createdDate || new Date()),
                                    client: row.client?.name,
                                    speciality: row.client?.speciality,
                                    location: `${row.client?.commune}, ${row.client?.wilaya}`,
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
                    />)}
            {/* <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
                <Table sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                    <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                        <TableRow>
                            <TableCell style={{ width: '25%' }} align="left">Date</TableCell>
                            <TableCell style={{ width: '50%' }} align="left">Client</TableCell>
                            <TableCell style={{ width: '50%' }} align="left">Specialite</TableCell>
                            <TableCell style={{ width: '50%' }} align="left">Wilaya</TableCell>
                            <TableCell style={{ width: '50%' }} align="left">Commune</TableCell>
                            <TableCell style={{ width: '50%' }} align="right">Rapport</TableCell>
                            <TableCell style={{ width: '50%' }} align="right">Bon de commande</TableCell>
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
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === row.id! ? 'cyan' : 'white' }}
                                    >
                                        <TableCell style={{ width: '250px', whiteSpace: 'nowrap', }}>{formatDateToYYYYMMDD(row.createdDate || new Date())}</TableCell>
                                        <TableCell align="left" style={{
                                            display: 'block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            margin: '0px',
                                            padding: '15px 0px',
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
        </div >
    );
};

export default DelegateTable;
