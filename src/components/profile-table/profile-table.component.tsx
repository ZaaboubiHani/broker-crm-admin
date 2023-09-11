import React from 'react';
import './profile-table.style.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UserModel from '../../models/user.model';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { DotSpinner } from '@uiball/loaders';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Input from '@mui/material/Input';

export interface ProfileTableProps {
    data: UserModel[];
    isLoading: boolean;
}

const ProfileTable: React.FC<ProfileTableProps> = ({ data, isLoading }) => {
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const wilayas: string[] = [
        "ADRAR",
        "BATNA",
        "ALGER",
    ];

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    return (
        <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', }} component={Paper}>
            <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                <TableHead sx={{ display: 'flex', justifyContent: 'stretch', alignItems: 'stretch', height: '45px', width: "100%" }}>
                    <TableRow sx={{ flexGrow: '1' }}>
                        <TableCell sx={{ width: '100px' }} align='left'>Création</TableCell>
                        <TableCell sx={{ m: 1, width: '10%' }} align='center'>Nom et prénom</TableCell>
                        <TableCell align="center">Mobile</TableCell>
                        <TableCell align="center">E-mail</TableCell>
                        <TableCell align="right">Mot de passe</TableCell>
                        <TableCell sx={{ m: 1, width: '200px' }} align="right">Wilayat</TableCell>
                        <TableCell sx={{ width: '0px' }} align="right">Blocage</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ flexGrow: '1', height: "1px" }}>
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
                            data.map((row) => (
                                <TableRow
                                    key={row.id!}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, flexGrow: '1', width: '100%' }}
                                >
                                    <TableCell sx={{ width: '100px', whiteSpace: 'nowrap' }} >{formatDateToYYYYMMDD(row.createdAt || new Date())}</TableCell>
                                    <TableCell sx={{ width: '10%' }} align="left">{row.username}</TableCell>
                                    <TableCell align="left">{row.phoneOne}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left" >
                                        <FormControl sx={{ m: 1, margin: '0px', padding: '0px' }} variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type={showPassword ? 'text' : 'password'}

                                                onChange={(event)=>{
                                                    row.password = event.target.value;
                                                }}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell sx={{ width: '200px' }} align="left">
                                        <FormControl sx={{ m: 1, width: 200 }} size="small">
                                            <InputLabel id="demo-multiple-checkbox-label">Wilayat</InputLabel>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={row.wilayas?.map<string>(w => w.name!)}
                                                onChange={handleChange}
                                                input={<OutlinedInput label="Tag" />}
                                                renderValue={(selected) => selected.join(',')}
                                            >
                                                {wilayas.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox checked={row.wilayas?.some(w => w.name === name)} />
                                                        <ListItemText primary={name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell sx={{ width: '0px', padding: '0px' }}>
                                        <Switch onChange={()=>{
                                            row.isBlocked = !row.isBlocked;
                                        }} checked={row.isBlocked} />
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default ProfileTable;
