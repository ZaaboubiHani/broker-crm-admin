import React from 'react';
import './profile-table.style.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UserModel, { UserType } from '../../models/user.model';
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
import WilayaModel from '../../models/wilaya.model';
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

export interface ProfileTableProps {
    data: UserModel[];
    isLoading: boolean;
    wilayas: WilayaModel[]
}

const ProfileTable: React.FC<ProfileTableProps> = ({ data, isLoading, wilayas, }) => {
   



    
    const [stateTrigger, setStateTrigger] = React.useState<boolean>(false);

    const handleChange = (value: string[], index: number) => {
        data[index].wilayas = [...wilayas.filter(w => value.includes(w.name!.toLowerCase()))];

        setStateTrigger(!stateTrigger);
    };

    const [showPassword, setShowPassword] = React.useState(Array(10).fill(false));

    const handleClickShowPassword = (index:number) => {
        showPassword[index] = !showPassword[index];
        setShowPassword([...showPassword]);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Création', width: 150 },
        { field: 'username', headerName: 'Nom et prénom', width: 150 },
        { field: 'phone', headerName: 'Mobile', width: 200 },
        { field: 'email', headerName: 'E-mail', width: 200 },
        { field: 'type', headerName: 'Type',  width: 100 },
        { field: 'password', headerName: 'Mot de passe', width: 150, 
           

            renderCell(params) {
                return (<FormControl sx={{ m: 1, margin: '0px', padding: '0px' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword[params.row.index] ? 'text' : 'password'}

                    onChange={(event) => {
                        params.row.password = event.target.value;
                        setStateTrigger(!stateTrigger);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={()=>handleClickShowPassword(params.row.index)}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword[params.row.index] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>);
            },

        }, 
        { field: 'wilayat', headerName: 'Wilayat', width: 150 },
        { field: 'isBlocked', headerName: 'Blocage', width: 150 },
       
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', marginRight: '16px' }}>
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
                            [ ...data.map((row,index) => {

                                return {
                                    id: row.id,
                                    index:index,
                                    date: formatDateToYYYYMMDD(row.createdAt || new Date()),
                                    username: row.username,
                                    phone: row.phoneOne,
                                    password: row.password,
                                    email: row.email,
                                    type: row.type === UserType.supervisor ? 'Superviseur' : row.type === UserType.kam ? 'Kam' : 'délégué',
                                    isBlocked: row.isBlocked,
                                };
                            })]}
                        columns={columns}
                        hideFooterPagination={true}
                        hideFooter={true}
                       
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        checkboxSelection={false}

                    />)}
            {/* <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden' }} component={Paper}>
                <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                    <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                        <TableRow>
                            <TableCell sx={{ width: '100px' }} align='left'>Création</TableCell>
                            <TableCell sx={{ width: '15%' }} align='left'>Nom et prénom</TableCell>
                            <TableCell sx={{ width: '15%' }} align="left">Mobile</TableCell>
                            <TableCell sx={{ width: '15%' }} align="left">E-mail</TableCell>
                            <TableCell sx={{ width: '10%' }} align="left">Type</TableCell>
                            <TableCell sx={{ width: '17%' }} align="right">Mot de passe</TableCell>
                            <TableCell sx={{ width: '200px' }} align="right">Wilayat</TableCell>
                            <TableCell sx={{ width: '100px' }} align="right">Blocage</TableCell>
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
                                        <TableCell sx={{ width: '100px', whiteSpace: 'nowrap', margin: '0px' }} >{formatDateToYYYYMMDD(row.createdAt || new Date())}</TableCell>
                                        <TableCell sx={{ width: '15%' }} align="left">{row.username}</TableCell>
                                        <TableCell sx={{ width: '15%' }} align="left">{row.phoneOne}</TableCell>
                                        <TableCell sx={{
                                            display: 'block',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            padding: '20px 0px',
                                        }} align="left">{row.email}</TableCell>
                                        <TableCell sx={{ width: '10%' }} align="left">{row.type === UserType.supervisor ? 'Superviseur' : row.type === UserType.kam ? 'Kam' : 'délégué'}</TableCell>
                                        <TableCell sx={{ width: '17%' }} align="left" >
                                            <FormControl sx={{ m: 1, margin: '0px', padding: '0px' }} variant="standard">
                                                <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                                                <Input
                                                    id="standard-adornment-password"
                                                    type={showPassword[index] ? 'text' : 'password'}

                                                    onChange={(event) => {
                                                        row.password = event.target.value;
                                                        setStateTrigger(!stateTrigger);
                                                    }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={()=>handleClickShowPassword(index)}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword[index] ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell sx={{ width: '200px', margin: '0px', padding: '0px' }} align="right">
                                            {
                                                row.type === UserType.supervisor ? (
                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end', height: '60px', margin: '0px', padding: '0px' }}>
                                                        <p style={{ fontSize: '17px', fontWeight: '500' }}>
                                                            Accès total
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <FormControl sx={{ m: 1, width: 200, margin: '0px', padding: '0px' }} size="small">
                                                        <InputLabel id="demo-multiple-checkbox-label">Wilayat</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-checkbox-label"
                                                            id="demo-multiple-checkbox"
                                                            multiple
                                                            value={row.wilayas?.map<string>(w => w.name?.toLowerCase() ?? '')}
                                                            onChange={(event) => handleChange((event.target.value as string[]), index)}
                                                            input={<OutlinedInput label="Tag" />}
                                                            renderValue={(selected) => selected.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(',')}
                                                        >
                                                            {wilayas.map((wilaya) => (
                                                                <MenuItem key={wilaya.id} value={wilaya.name?.toLowerCase()}>
                                                                    <Checkbox checked={row.wilayas?.some(w => w.name?.toLowerCase() === wilaya.name?.toLowerCase())} />
                                                                    <ListItemText primary={wilaya.name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell sx={{ width: '100px', padding: '0px' }} align='center'>
                                            <Switch onChange={() => {
                                                row.isBlocked = !row.isBlocked;
                                                setStateTrigger(!stateTrigger);
                                            }} checked={row.isBlocked} />
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
        </div>
    );
};

export default ProfileTable;
