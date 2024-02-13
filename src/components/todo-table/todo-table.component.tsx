import React from 'react';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { DotSpinner } from '@uiball/loaders';
import Button from '@mui/material/Button';
import ScalableTable from '../scalable-table/scalable-table.component';
import TodoModel, { TodoStatus } from '../../models/todo.model';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

interface TodoTableProps {
    data: TodoModel[];
    id?: string;
    isLoading: boolean;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({ data, id, isLoading, total, size, page, pageChange, }) => {
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
                                    action: row.action,
                                    task: row.task,
                                    region: row.region,
                                    targetRemark: row.targetRemark,
                                    remark: row.remark,
                                    status: row.status,
                                    startDate: formatDateToYYYYMMDD(row!.startDate!),
                                    endDate: formatDateToYYYYMMDD(row!.endDate!),
                                };
                            })]}
                        columns={[
                            {
                                field: 'action',
                                headerName: 'Action',
                            },
                            {
                                field: 'task',
                                headerName: 'Tâche',
                            },
                            {
                                field: 'region',
                                headerName: 'Région',
                            },
                            {
                                field: 'targetRemark',
                                headerName: 'Remarque du délégué',
                            },
                            {
                                field: 'remark',
                                headerName: 'Remarque',
                            },
                            {
                                field: 'status',
                                headerName: 'Statut',
                                renderCell(params) {
                                    return (<div
                                        style={{
                                            color: params.row.status === TodoStatus.cancelled ? 'red' : params.row.status === TodoStatus.ignored ? 'rgb(255,69,0)' : params.row.status === TodoStatus.done ? 'green' : params.row.status === TodoStatus.pending ? 'blue' : 'black',
                                            fontWeight: '700'
                                        }}
                                    >{params.row.status === TodoStatus.cancelled ? 'Annulée' : params.row.status === TodoStatus.ignored ? 'Ignorée' : params.row.status === TodoStatus.done ? 'Complétée' : params.row.status === TodoStatus.pending ? 'En attente' : 'Inconnue'}</div>);
                                },
                            },
                            {
                                field: 'startDate',
                                headerName: 'Date de début',
                            },
                            {
                                field: 'endDate',
                                headerName: 'Date de fin',
                            },
                            // {
                            //     field: 'cancel',
                            //     headerName: 'Annuler',
                            //     renderCell(params) {
                            //         return (<Button
                            //             sx={{ color: 'red' }}
                            //             onClick={() => {

                            //             }} variant="text"> <DoDisturbOnIcon /></Button>);
                            //     },
                            // },
                        ]}
                        total={total}
                        onPaginationChange={(model) => {
                            setPageIndex(model.page);
                            pageChange(model.page + 1, model.size);
                            setRowsPerPage(model.size);
                        }}

                        pagination={{
                            size: rowsPerPage,
                            page: pageIndex,
                        }}

                        pageSizeOptions={[5, 10, 25, 50, 100]}

                    />)}
        </div>
    );
};

export default TodoTable;
