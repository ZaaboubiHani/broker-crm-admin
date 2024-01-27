import React, { useState } from 'react';
import VisitModel from '../../models/visit.model';
import { DotSpinner } from '@uiball/loaders'
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SpecialityModel from '../../models/speciality.model';
import EditIcon from '@mui/icons-material/Edit';

interface SpecialityTableProps {
    data: SpecialityModel[];
    isLoading: boolean;
    onRemove: (id: number) => void;
    onEdit: (speciality: SpecialityModel) => void;
    id?: string;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const SpecialityTable: React.FC<SpecialityTableProps> = ({ data, id, isLoading, onRemove, onEdit, total, size, page, pageChange, }) => {

    const [rowsPerPage, setRowsPerPage] = React.useState(size);

    const [pageIndex, setPageIndex] = React.useState(page - 1);

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }

    const columns: GridColDef[] = [
        {
            field: 'name', headerName: 'Nom de spécialité', width: 200,
            filterable: false,
        },
        // {
        //     field: 'edit', headerName: 'Modifier', width: 80,
        //     filterable: false,
        //     headerAlign: 'center',
        //     align: 'center',
        //     renderCell(params) {
        //         return (<IconButton onClick={() => {
        //             onEdit(params.row.model);
        //         }} >
        //             <EditIcon />
        //         </IconButton>);
        //     },
        // },
        {
            field: 'delete', headerName: 'Supprimer', width: 80,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell(params) {
                return (<IconButton onClick={() => {
                    onRemove(params.row.id);
                }} >
                    <DeleteIcon />
                </IconButton>);
            },
        },

    ];

    return (
        <div id={id}
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: '1',
                borderRadius: '8px',
                backgroundColor: 'white',

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
                                    name: row.name,
                                    model: row,
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
                        hideFooterPagination={true}
                        hideFooter={true}
                    />)}
        </div>
    );
};

export default SpecialityTable;
