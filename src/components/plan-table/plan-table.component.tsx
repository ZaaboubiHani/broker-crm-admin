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

interface PlanTableProps {
    data: VisitTaskModel[];
    isLoading: boolean;
    onDisplayDetails: (date: Date) => {};
    onDisplayMap: (date: Date) => {};
    id?: string;
}

const PlanTable: React.FC<PlanTableProps> = ({ data, id, isLoading, onDisplayDetails, onDisplayMap }) => {



    const columns: GridColDef[] = [

        {
            field: 'date', headerName: 'Date', width: 100, valueFormatter(params) {
                return formatDateToYYYYMMDD(params.value);
            },
        },
        {
            field: 'sldkifu', headerName: 'Wilayas', width: 200,

            resizable: true,

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
            field: 'tasks', headerName: 'Visites programmes', width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'visits', headerName: 'visites realiser', width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'details', headerName: 'Details',
            renderCell(params) {
                return (<Button onClick={() => {
                    onDisplayDetails(params.row.date);
                }} variant="text">Voir</Button>);
            },

        },
        {
            field: 'map', headerName: 'Carte de parcours', width: 150,
            align: 'center',
            renderCell(params) {
                return (<Button onClick={() => {
                    onDisplayMap(params.row.date,);
                }} variant="text"><MapIcon /></Button>);
            },

        },



    ];


    function findMax(wilaysa: VisitTaskModel[]): number {
        if (wilaysa.length === 0) {
            return 0;
        }

        let max: number = 0;

        for (const wilaya of wilaysa) {
            if (wilaya!.tasksWilayasCommunes!.length > max) {
                max = wilaya!.tasksWilayasCommunes!.length;
            }
        }

        return max;
    }

    return (
        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            margin: '0px 8px 8px 16px',
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
                            [...data.map((row, index) => {
                                return {
                                    id: index,
                                    date: row.date || new Date(),
                                    wilayas: row.tasksWilayasCommunes?.map(twc => `(${twc})`),
                                    tasks: row.numTasks,
                                    visits: row.numVisits,
                                };
                            })]}
                        columns={columns}

                        rowHeight={52 + (findMax(data) - 1) * 10}
                        hideFooterPagination={true}
                        hideFooter={true}
                        checkboxSelection={false}

                    />)}
        </div>
        // <TableContainer id={id} sx={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', }} component={Paper}>
        //     <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
        //         <TableHead sx={{ height: '45px', marginBottom: '16px', }}>
        //             <TableRow >
        //                 <TableCell sx={{ width: '230px' }} align='left'>Date</TableCell>
        //                 <TableCell sx={{ width: '20%' }} align="left">wilayas</TableCell>
        //                 <TableCell sx={{ width: '20%' }} align="left">Visites programmes</TableCell>
        //                 <TableCell sx={{ width: '20%' }} align="left">visites realiser</TableCell>
        //                 <TableCell sx={{ width: '20%' }} align="right">Details</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
        //             {
        //                 isLoading ? (<div style={{
        //                     width: '100%',
        //                     flexGrow: '1',
        //                     overflow: 'hidden',
        //                     height: '100%',
        //                     display: 'flex',
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                 }}>
        //                     <DotSpinner
        //                         size={40}
        //                         speed={0.9}
        //                         color="black"
        //                     />
        //                 </div>) :
        //                     data.map((row, index) => (
        //                         <TableRow
        //                             key={index}
        //                             sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === index! ? 'cyan' : 'white' }}
        //                         >
        //                             <TableCell sx={{ width: '250px' }} >{formatDateToYYYYMMDD(row.date || new Date())}</TableCell>
        //                             <TableCell sx={{ width: '20%' }} align="left">{row.tasksWilayasCommunes?.map(twc => `(${twc})`).join(' ')}</TableCell>
        //                             <TableCell sx={{ width: '20%' }} align="center">{row.numTasks}</TableCell>
        //                             <TableCell sx={{ width: '20%' }} align="center">{row.numVisits}</TableCell>
        //                             <TableCell sx={{ width: '20%' }} align="right">
        //                                 <Button onClick={() => {
        //                                     onDisplayDetails(row.date || new Date(),index);
        //                                 }} variant="text">Voir</Button>
        //                             </TableCell>
        //                         </TableRow>
        //                     ))}
        //         </TableBody>
        //     </Table>
        // </TableContainer>


    );
};

export default PlanTable;
