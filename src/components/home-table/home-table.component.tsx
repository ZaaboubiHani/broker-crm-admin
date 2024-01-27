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
    sorting: {field:string,order:boolean};
    pageChange: (page: number, size: number) => void;
    sortChange: (field: string, order: boolean) => void;
}

const HomeTable: React.FC<HomeTableProps> = ({ data, id, isLoading, firstHeader, onDisplayReport, onDisplayCommand, total, size, page, sorting,pageChange, sortChange }) => {

    const [sortModel, setSortModel] = React.useState<{field:string,order:boolean}>(sorting);
    const [rowsPerPage, setRowsPerPage] = React.useState(size);

    const [pageIndex, setPageIndex] = React.useState(page - 1);

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }

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
                                    sortable:true,
                                },
                                {
                                    field: 'client',
                                    headerName: 'Client',
                                    sortable:true,
                                },
                                {
                                    field: 'speciality',
                                    headerName: 'Spécialité',
                                    sortable:true,
                                },
                                {
                                    field: 'location',
                                    headerName: 'Localisation',
                                    sortable:true,
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
                                    headerName: 'BC',
                                    renderCell(params) {
                                        return (<Button disabled={!params.row.hasCommand} onClick={() => {
                                            onDisplayCommand(params.row.visit);
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
                                        location: `${row.client?.commune}, ${row.client?.wilaya}`,
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
                            onSortChange={(model) => {
                                sortChange(model.field, model.order);
                                setSortModel(model);
                            }}
                            sortModel={sortModel}
                            total={total}
                        ></ScalableTable>

                    )

               
            }
        </div>
    );
};

export default HomeTable;
