import React from 'react';
import './plan-table.style.css';
import Client from '../../models/client.model';
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
import VisitTaskModel from '../../models/visit-task.model';
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import MapIcon from '@mui/icons-material/Map';
import RouteIcon from '@mui/icons-material/Route';
import ScalableTable from '../scalable-table/scalable-table.component';

interface PlanTableProps {
    data: VisitTaskModel[];
    isLoading: boolean;
    onDisplayDetails: (date: Date) => {};
    onDisplayMap: (date: Date) => {};
    id?: string;
}

const PlanTable: React.FC<PlanTableProps> = ({ data, id, isLoading, onDisplayDetails, onDisplayMap }) => {



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
                            [...data.map((row, index) => {
                                return {
                                    id: index,
                                    date: row.date || new Date(),
                                    wilayas: row.tasksWilayasCommunes?.map(twc => `(${twc})`),
                                    tasks: row.numTasks,
                                    visits: row.numVisits,
                                };
                            })]}
                        columns={[{
                            field: 'date',
                            headerName: 'Date',
                            valueFormatter(params) {
                                return formatDateToYYYYMMDD(params.value);
                            },
                        },
                        {
                            field: 'sldkifu',
                            headerName: 'Wilayas',
                            renderCell(params) {
                                return (
                                    <div>

                                        {params.row.wilayas.map((w: any) => {
                                            return (
                                                <div>
                                                    {w}
                                                </div>
                                            )
                                        })}

                                    </div>
                                );
                            },
                        },
                        {
                            field: 'tasks',
                            headerName: 'Visites programmes',
                        },
                        {
                            field: 'visits',
                            headerName: 'visites realiser',
                        },
                        {
                            field: 'details',
                            headerName: 'Details',
                            renderCell(params) {
                                return (<Button
                                    disabled={params.row.tasks === 0 && params.row.visits === 0}
                                    onClick={() => {
                                        onDisplayDetails(params.row.date);
                                    }} variant="text">Voir</Button>);
                            },

                        },
                        {
                            field: 'map',
                            headerName: 'Carte de parcours',
                            renderCell(params) {
                                return (<Button
                                    onClick={() => {
                                        onDisplayMap(params.row.date,);
                                    }} variant="text"><MapIcon /></Button>);
                            },
                        }]}
                        hidePaginationFooter={true}
                    />)}
        </div>



    );
};

export default PlanTable;
