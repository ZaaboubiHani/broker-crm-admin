import React from 'react';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import VisitModel from '../../models/visit.model';
import ScalableTable from '../scalable-table/scalable-table.component';
import ClientModel from '@/src/models/client.model';

interface ClientsPharmacyTableProps {
    data: ClientModel[];
    displayVisits: (client: ClientModel) => {};
    pageChange: (page: number, size: number) => void;
    id?: string;
    page: number;
    size: number;
    total: number;
    isLoading: boolean;
    sorting: { field: string, order: boolean };
    sortChange: (field: string, order: boolean) => void;
}

const ClientsPharmacyTable: React.FC<ClientsPharmacyTableProps> = ({ sorting, total, size, page, pageChange, data, id, isLoading, displayVisits, sortChange }) => {
    const [rowsPerPage, setRowsPerPage] = React.useState(size);
    const [pageIndex, setPageIndex] = React.useState(page - 1);
    const [sortModel, setSortModel] = React.useState<{ field: string, order: boolean }>(sorting);
    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }


    return (
        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: '8px',
            marginRight: '-2px',
            height: '100%'
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
                                    name: row?.name,
                                    location: `${row?.commune}, ${row?.wilaya}`,
                                    numVisits: row?.numVisits,
                                    client: row
                                };
                            })]}
                        columns={[
                            {
                                field: 'numVisits',
                                headerName: 'Nombre de visites',
                                sortable: true,
                            },
                            {
                                field: 'name',
                                headerName: 'Client',
                                sortable: true,
                            },
                            {
                                field: 'location',
                                headerName: 'Localisation',
                                sortable: true,
                            },
                            {
                                field: 'visits',
                                headerName: 'Visites',
                                renderCell(params) {
                                    return (<Button onClick={() => {
                                        displayVisits(params.row.client);
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
                        onSortChange={(model) => {
                            sortChange(model.field, model.order);
                            setSortModel(model);
                        }}
                        sortModel={sortModel}
                        pagination={{
                            size: rowsPerPage,
                            page: pageIndex,
                        }}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                    />)}

        </div>

    );
};

export default ClientsPharmacyTable;
