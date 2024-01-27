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
import ScalableTable from '../scalable-table/scalable-table.component';

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


    return (
        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: '8px',
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
                    (<ScalableTable
                        rows={
                            [...data.map((row) => {
                                return {
                                    id: row.id,
                                    date: row.createdDate || new Date(),
                                    client: row.client?.name,
                                    delegate: row.user?.username,
                                    location: `${row.client?.commune}, ${row.client?.wilaya}`,
                                    visitLocation: row.visitLocation,
                                    hasCommand: row.hasCommand,
                                    visit: row
                                };
                            })]}
                        columns={[
                            {
                                field: 'date',
                                headerName: 'Date',
                                valueFormatter(params) {
                                    return formatDateToYYYYMMDD(params.value);
                                },
                            },
                            {
                                field: 'client',
                                headerName: 'Client',
                            },
                            {
                                field: 'delegate',
                                headerName: 'Délégué',
                            },
                            {
                                field: 'location',
                                headerName: 'Localisation',
                            },
                            {
                                field: 'report',
                                headerName: 'Rapport',
                                renderCell(params) {
                                    return (<Button onClick={() => {
                                        displayReport(params.row.visit);
                                    }} variant="text">Voir</Button>);
                                },
                            },
                            {
                                field: 'command',
                                headerName: 'BC',
                                renderCell(params) {
                                    return (<Button disabled={!params.row.hasCommand} onClick={() => {
                                        displayCommand(params.row.visit);
                                    }} variant="text">Voir</Button>);
                                },
                            },
                        ]}
                        total={total}
                        onPaginationChange={(model) => {
                            setPageIndex(model.page);
                            pageChange(model.page + 1, model.size);
                            setRowsPerPage(model.size);

                        }}

                        pagination={
                            {
                                size: rowsPerPage,
                                page: pageIndex,

                            }
                        }
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                    />)}

        </div>

    );
};

export default ClientsPharmacyTable;
