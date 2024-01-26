import React, { useState } from 'react';
import './home-table.style.css';
import VisitModel from '../../models/visit.model';
import { DotSpinner } from '@uiball/loaders'
import Button from '@mui/material/Button';
import ScalableTable from '../scalable-table/scalable-table.component';


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

    // const columns: GridColDef[] = [
    //     {
    //         field: 'username',
    //         headerName: firstHeader,
    //         width: 150,
    //         filterable: false,
    //         sortable: false,
    //     },
    //     {
    //         field: 'client', headerName: 'Client', width: 170,
    //         filterable: false,
    //         sortable: false,
    //     },
    //     {
    //         field: 'speciality', headerName: 'Spécialité', width: 130,
    //         filterable: false,
    //         sortable: false,
    //     },
    //     {
    //         field: 'location', headerName: 'Localisation', width: 200,
    //         filterable: false,
    //         sortable: false,
    //     },
    //     {
    //         field: 'report', headerName: 'Rapport', width: 80,
    //         filterable: false,
    //         sortable: false,
    //         renderCell(params) {
    //             return (<Button onClick={() => {
    //                 onDisplayReport(params.row.visit);
    //             }} variant="text">Voir</Button>);
    //         },
    //     },
    //     {
    //         field: 'command', headerName: 'Bon de commande', width: 150,
    //         align: 'center',
    //         filterable: false,
    //         sortable: false,
    //         renderCell(params) {
    //             return (<Button disabled={!params.row.hasCommand} onClick={() => {
    //                 onDisplayCommand(params.row);
    //             }} variant="text">Voir</Button>);
    //         },
    //     },
    // ];

    return (
        <div id={id}
            style={{
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
                    (

                        <ScalableTable
                            columns={[
                                {
                                    field: 'username',
                                    headerName: firstHeader,
                                },
                                {
                                    field: 'client',
                                    headerName: 'Client',
                                },
                                {
                                    field: 'speciality',
                                    headerName: 'Spécialité',
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
                                            onDisplayReport(params.row.visit);
                                        }} variant="text">Voir</Button>);
                                    },
                                },
                                {
                                    field: 'command',
                                    headerName: 'Bon de commande',
                                    renderCell(params) {
                                        return (<Button disabled={!params.row.hasCommand} onClick={() => {
                                            onDisplayCommand(params.row);
                                        }} variant="text">Voir</Button>);
                                    },
                                },

                            ]}
                            rows={
                                [...data.map((row) => {
                                    return {
                                        id: row.id,
                                        username: row.user?.username,
                                        client: row.client?.name,
                                        speciality: row.client?.speciality,
                                        location: `${row.client?.wilaya}, ${row.client?.commune}`,
                                        hasCommand: row.hasCommand,
                                        visitLocation: row.visitLocation,
                                        visit: row,
                                    };
                                })]}
                            pagination={{
                                size: rowsPerPage,
                                page: pageIndex,
                            }}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            onPaginationChange={(model) => {
                                setPageIndex(model.page);
                                pageChange(model.page + 1, model.size);
                                setRowsPerPage(model.size);
                            }}
                            total={total}
                        ></ScalableTable>

                    )

                // <DataGrid
                //     rows={
                //         [...Array.from({ length: rowsPerPage * pageIndex }, (_, index) => {
                //             return { id: index };
                //         }), ...data.map((row) => {
                //             return {
                //                 id: row.id,
                //                 username: row.user?.username,
                //                 client: row.client?.name,
                //                 speciality: row.client?.speciality,
                //                 location: `${row.client?.wilaya}, ${row.client?.commune}`,
                //                 hasCommand: row.hasCommand,
                //                 visitLocation: row.visitLocation,
                //                 visit:row,
                //             };
                //         })]}

                //     columns={columns}
                //     rowCount={total}
                //     onPaginationModelChange={(model) => {
                //         setPageIndex(model.page);
                //         pageChange(model.page + 1, model.pageSize);
                //         setRowsPerPage(model.pageSize);
                //     }}
                //     initialState={{
                //         pagination: {
                //             paginationModel: {
                //                 pageSize: rowsPerPage,
                //                 page: pageIndex,
                //             },
                //         },
                //     }}
                //     pageSizeOptions={[5, 10, 25, 50, 100]}
                //     checkboxSelection={false}
                //     hideFooterSelectedRowCount={true}
                // />)
            }
        </div>
    );
};

export default HomeTable;
