import React from 'react';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import VisitModel from '../../models/visit.model';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ScalableTable from '../scalable-table/scalable-table.component';

interface ClientsDoctorTableProps {
    data: VisitModel[];
    displayReport: (visit: VisitModel) => {};
    id?: string;
    pageChange: (page: number, size: number) => void;
    page: number;
    size: number;
    total: number;
    isLoading: boolean;
}

const ClientsDoctorTable: React.FC<ClientsDoctorTableProps> = ({ total, size, page, pageChange, data, id, isLoading, displayReport }) => {

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
                                    speciality: row.client?.speciality,
                                    location: `${row.client?.commune}, ${row.client?.wilaya}`,
                                    visitLocation: row.visitLocation,
                                    visit: row,
                                };
                            })]}
                        columns={[
                            {
                                field: 'date', headerName: 'Date',
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
                                field: 'speciality',
                                headerName: 'Spécialité',
                            },
                            {
                                field: 'location',
                                headerName: 'Localisation',
                            },
                            {
                                field: 'report', headerName: 'Rapport',
                                renderCell(params) {
                                    return (<Button onClick={() => {
                                        displayReport(params.row.visit);
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

export default ClientsDoctorTable;
