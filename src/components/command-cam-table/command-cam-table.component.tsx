import React from 'react';
import './command-cam-table.style.css';
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
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import SupplierModel from '../../models/supplier.model';

interface CommandCamTableProps {
    data: CommandModel[];
    suppliers: SupplierModel[];
    displayCommand: (command: CommandModel) => {};
    onHonor: (command: CommandModel) => {};
    id?: string;
    isLoading: boolean;
    page: number;
    size: number;
    total: number;
    pageChange: (page: number, size: number) => void;
}

const CommandCamTable: React.FC<CommandCamTableProps> = ({ data, id, suppliers, isLoading, displayCommand, total, size, page, pageChange, onHonor, }) => {

    const [rowsPerPage, setRowsPerPage] = React.useState(size);
    const [pageIndex, setPageIndex] = React.useState(page - 1);
    const [showDialog, setShowDialog] = React.useState(false);
    const [commandIndex, setCommandIndex] = React.useState(- 1);
    const [supplierId, setSupplierId] = React.useState<number | undefined>();

    if (pageIndex !== (page - 1)) {
        setPageIndex(page - 1);
    }

    const [switchesState, setSwitchesState] = React.useState(data.map(command => command.isHonored));

    const [switchesEnablers, setSwitchesEnablers] = React.useState(data.map(command => command?.finalSupplier === undefined));

    React.useEffect(() => {
        setSwitchesState(data.map(command => command.isHonored));
        let swis = data.map(command => (command?.finalSupplier === undefined && command.visit?.client?.speciality === 'GROSSISTE para'));
        setSwitchesEnablers(swis);
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

    const handleClose = () => {
        setShowDialog(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'date', headerName: 'Date', width: 150, valueFormatter(params) {
                return formatDateToYYYYMMDD(params.value);
            },
        },
        { field: 'client', headerName: 'Client', width: 150 },
        { field: 'location', headerName: 'Localisation', minWidth: 150, maxWidth: 200 },
        { field: 'amount', headerName: 'Montant', width: 150, },
        {
            field: 'supplier', headerName: 'Fournisseur', width: 200,
            renderCell(params) {
                return params.row.speciality === 'GROSSISTE para' ? (<FormControl fullWidth>
                    <Select
                        value={supplierId}
                        key={supplierId}
                        onChange={(event) => {
                            if (event.target.value === "other") {
                                event.preventDefault();
                                event.target.value = "";
                                setCommandIndex(params.row.index);
                                setShowDialog(true);
                                setSupplierId(-1);
                            } else {
                                params.row.finalSupplier = params.row.suppliers?.find((s: any) => s.id === event.target.value);
                                data[params.row.index].finalSupplier = data[params.row.index].suppliers?.find((s: any) => s.id === event.target.value);
                                handleSupplierChange(params.row.index);
                                setSupplierId(params.row.finalSupplier?.id);
                            }
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
                        <MenuItem value="other">
                            <em>autre</em>
                        </MenuItem>
                    </Select>
                </FormControl>) : undefined;
            },
        },
        {
            field: 'honor', headerName: 'Honorer', width: 80,
            renderCell(params) {
                return (<Switch disabled={switchesEnablers[params.row.index]} checked={switchesState[params.row.index]}
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
        <div id={id} style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            margin: '0px 8px 8px 8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.5)',
        }}>
            {isLoading ? (<div style={{
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
                                index: index,
                                date: row.visit?.createdDate || new Date(),
                                client: row.visit?.client?.name,
                                speciality: row.visit?.client?.speciality,
                                amount: row.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),
                                location: `${row.visit?.client?.wilaya}, ${row.visit?.client?.commune}`,
                                command: row,
                                suppliers: row.suppliers,
                                finalSupplier: row.finalSupplier,
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
            <Dialog fullWidth={true} maxWidth='sm' onClose={handleClose} open={showDialog} >
                <DialogTitle>Sélectionner le fournisseur</DialogTitle>
                <List>
                    {
                        suppliers.filter((supplier)=>!data.some((c)=>c.suppliers?.some(s=>s.id === supplier.id))).map((supplier) => (
                            <ListItem
                                key={supplier.id}  
                                disablePadding
                                onClick={() => {
                                    const updatedCommands = [...data];
                                    updatedCommands[commandIndex].suppliers = [
                                        ...updatedCommands[commandIndex].suppliers ?? [],
                                        supplier,
                                    ];
                                    updatedCommands[commandIndex].finalSupplier = supplier;
                                    data = updatedCommands;
                                    setShowDialog(false);
                                    setSupplierId(supplier.id);
                                }}
                            >
                                <ListItemButton>
                                    <ListItemText primary={supplier.name} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Dialog>
        </div>
    );
};

export default CommandCamTable;
