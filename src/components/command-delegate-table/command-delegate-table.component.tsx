import React, { ChangeEvent } from 'react';
import './command-delegate-table.style.css';
import CommandModel from '../../models/command.model';
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
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface CommandDelegateTableProps {
    data: CommandModel[];
    displayCommand: (command: CommandModel) => {};
    onHonor: (command: CommandModel) => {};
    id?: string;
    isLoading?: boolean;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const CommandDelegateTable: React.FC<CommandDelegateTableProps> = ({ data, id, isLoading, displayCommand, onHonor, total, size, page, pageChange, }) => {

    const [rowsPerPage, setRowsPerPage] = React.useState(size);


    const [pageIndex, setPageIndex] = React.useState(page - 1);

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }

    const [switchesState, setSwitchesState] = React.useState(data.map(command => command.isHonored));

    const [switchesEnablers, setSwitchesEnablers] = React.useState(data.map(command => command?.finalSupplier === undefined));

    React.useEffect(() => {
        setSwitchesState(data.map(command => command.isHonored));
        setSwitchesEnablers(data.map(command => command?.finalSupplier === undefined));
    }, [data]);

    const handleSwitchChange = (index: number) => {
        const newSwitchesState = [...switchesState];
        newSwitchesState[index] = !newSwitchesState[index];
        data[index].isHonored = !data[index].isHonored;
        setSwitchesState(newSwitchesState);
        onHonor(data[index]);
    };

    const handleSupplierChange = (index: number) => {
        const newSwitchesEnablers = [...switchesEnablers];
        newSwitchesEnablers[index] = data[index].finalSupplier === undefined;
        if (newSwitchesEnablers[index] && data[index].isHonored) {
            const newSwitchesState = [...switchesState];
            newSwitchesState[index] = false;
            data[index].isHonored = false;
            setSwitchesState(newSwitchesState);
            onHonor(data[index]);
        }
        setSwitchesEnablers(newSwitchesEnablers);
    };

    const columns: GridColDef[] = [

        {
            field: 'date', headerName: 'Date', width: 150, valueFormatter(params) {
                return formatDateToYYYYMMDD(params.value);
            },
        },
        { field: 'client', headerName: 'Client', width: 150 },
        { field: 'wilaya', headerName: 'Wilaya', width: 150 },
        { field: 'commune', headerName: 'Commune', width: 150, },
        { field: 'amount', headerName: 'Montant', width: 150, },
        {
            field: 'supplier', headerName: 'Fournisseur', width: 200,
            renderCell(params) {
                return (<FormControl fullWidth>
                    <Select
                        id="demo-simple-select"
                        value={params.row.finalSupplier?.id}
                        onChange={(event) => {
                            params.row.finalSupplier = params.row.suppliers?.find((s: any) => s.id === event.target.value);
                            data[params.row.index].finalSupplier = data[params.row.index].suppliers?.find((s: any) => s.id === event.target.value);
                            handleSupplierChange(params.row.index);
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {params.row.suppliers?.map((supplier: any) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>);
            },
        },
        {
            field: 'honor', headerName: 'Honorer', width: 80,
            renderCell(params) {
                return ( <Switch disabled={switchesEnablers[params.row.index]} checked={switchesState[params.row.index]}
                    onChange={() => handleSwitchChange(params.row.index)}
                />);
            },
        },
        {
            field: 'details', headerName: 'Details', width: 80,
            renderCell(params) {
                return (<Button onClick={() => {
                    displayCommand(params.row.command);
                }} variant="text">Voir</Button>);
            },
        },
    ];


    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', marginRight: '16px' }}>
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
                            }), ...data.map((row, index) => {
                                return {
                                    id: row.id,
                                    date: row.visit?.createdDate || new Date(),
                                    client: row.visit?.client?.name,
                                    amount: row.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),
                                    wilaya: row.visit?.client?.wilaya,
                                    commune: row.visit?.client?.commune,
                                    command: row,
                                    finalSupplier: row.finalSupplier,
                                    suppliers: row.suppliers,
                                    index:index,
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

                    />)}
            {/* <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
                <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                    <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                        <TableRow>
                            <TableCell sx={{ width: '150px' }}>Date</TableCell>
                            <TableCell align="left">Client</TableCell>
                            <TableCell align="left">Wilaya</TableCell>
                            <TableCell align="center">Commune</TableCell>
                            <TableCell align="center">Montant</TableCell>
                            <TableCell sx={{ width: '20%' }} align="center">Fournisseur</TableCell>
                            <TableCell align="center">Honore</TableCell>
                            <TableCell align="center">Detail</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
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
                                data.map((row, index) => (
                                    <TableRow
                                        key={row.id!}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedRow === row.id! ? 'cyan' : 'white' }}
                                    >
                                        <TableCell sx={{ width: '150px', whiteSpace: 'nowrap' }}>{formatDateToYYYYMMDD(row.visit?.createdDate || new Date())}</TableCell>
                                        <TableCell align="left">{row.visit?.client?.name}</TableCell>
                                        <TableCell align="left">{row.visit?.client?.wilaya}</TableCell>
                                        <TableCell align="left">{row.visit?.client?.commune}</TableCell>
                                        <TableCell align="left">{

                                            row.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })
                                        }</TableCell>

                                        <TableCell sx={{ width: '20%' }} align="left">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Fournisseur</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={row.finalSupplier?.id}
                                                    label="Age"
                                                    onChange={(event) => {
                                                        row.finalSupplier = row.suppliers?.find(s => s.id === event.target.value);
                                                        handleSupplierChange(index);
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {row.suppliers?.map((supplier) => (
                                                        <MenuItem key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Switch disabled={switchesEnablers[index]} checked={switchesState[index]}
                                                onChange={() => handleSwitchChange(index)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => {
                                                displayCommand(row);
                                            }} variant="text">Voir</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ minHeight: '50px', overflow: 'hidden' }}
                labelRowsPerPage='Lignes par page'
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </div >
    );
};

export default CommandDelegateTable;
