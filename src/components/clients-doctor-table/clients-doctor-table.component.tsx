import React from 'react';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import VisitModel from '../../models/visit.model';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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

    const columns: GridColDef[] = [
        {
            field: 'date', headerName: 'Date', width: 150, valueFormatter(params) {
                return formatDateToYYYYMMDD(params.value);
            },
            filterable: false,
            sortable: false,
        },
        {
            field: 'client',
            headerName: 'Client',
            width: 250,
            filterable: false,
            sortable: false,
        },
        {
            field: 'delegate',
            headerName: 'Délégué',
            width: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: 'speciality',
            headerName: 'Spécialité',
            width: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: 'location',
            headerName: 'Localisation',
            width: 200,
            filterable: false,
            sortable: false,
        },
        {
            field: 'visitsNum',
            headerName: 'Nombre de visites',
            width: 150,
            align:'center',
            headerAlign:'center',
            filterable: false,
            sortable: false,
        },
        {
            field: 'report', headerName: 'Rapport', width: 80,
            renderCell(params) {
                return (<Button onClick={() => {
                    displayReport(params.row.visit);
                }} variant="text">Voir</Button>);
            },
            filterable: false,
            sortable: false,
        },
    ];

    return (
        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            marginRight: '16px',
            borderRadius: '8px',
            marginBottom: '8px',
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
                                    speciality: row.client?.speciality,
                                    location: `${row.client?.wilaya}, ${row.client?.commune}`,
                                    visitLocation: row.visitLocation,
                                    visit: row,
                                    visitsNum: row.client?.visitsNum,
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
            
        </div>
    );
};

export default ClientsDoctorTable;
