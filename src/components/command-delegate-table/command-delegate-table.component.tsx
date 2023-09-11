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

interface CommandDelegateTableProps {
    data: CommandModel[];
    displayCommand: (command: CommandModel) => {};
    onHonor: (command: CommandModel) => {};
    id?: string;
    isLoading?: boolean;
}

const CommandDelegateTable: React.FC<CommandDelegateTableProps> = ({ data, id, isLoading, displayCommand ,onHonor}) => {


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
        if(newSwitchesEnablers[index] && data[index].isHonored){
            const newSwitchesState = [...switchesState];
            newSwitchesState[index] = false;
            data[index].isHonored = false;
            setSwitchesState(newSwitchesState);
            onHonor(data[index]);
        }
        setSwitchesEnablers(newSwitchesEnablers);
    };

    return (
        <TableContainer id={id} sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
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
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
    );
};

export default CommandDelegateTable;
