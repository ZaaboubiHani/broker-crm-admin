import React from 'react';
import './profile-table.style.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UserModel, { UserType } from '../../models/user.model';
import EditIcon from '@mui/icons-material/Edit';
import { DotSpinner } from '@uiball/loaders';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Input from '@mui/material/Input';
import WilayaModel from '../../models/wilaya.model';
import Button from '@mui/material/Button';
import ScalableTable from '../scalable-table/scalable-table.component';

export interface ProfileTableProps {
    data: UserModel[];
    isLoading: boolean;
    wilayas: WilayaModel[],
    editUser: (user: UserModel) => void,
}

const ProfileTable: React.FC<ProfileTableProps> = ({ data, isLoading, wilayas, editUser }) => {

    const [stateTrigger, setStateTrigger] = React.useState<boolean>(false);

    const handleChange = (value: string[], index: number) => {
        data[index].wilayas = [...wilayas.filter(w => value.includes(w.name!.toLowerCase()))];

        setStateTrigger(!stateTrigger);
    };

    const [showPassword, setShowPassword] = React.useState(Array(10).fill(false));

    const handleClickShowPassword = (index: number) => {
        showPassword[index] = !showPassword[index];
        setShowPassword([...showPassword]);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: '8px',
            margin: '8px  0px -8px 8px',
            paddingRight: '24px',
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
                                    id: row.id,
                                    index: index,
                                    date: formatDateToYYYYMMDD(row.createdAt || new Date()),
                                    username: row.username,
                                    wilayas: row.wilayas,
                                    phone: row.phoneOne,
                                    password: row.password,
                                    email: row.email,
                                    type: row.type === UserType.supervisor ? 'Superviseur' : row.type === UserType.kam ? 'Kam' : row.type === UserType.operator ? 'Opératrice' : 'Délégué',
                                    isBlocked: row.isBlocked,
                                    user: row,
                                };
                            })]}
                        columns={[
                            {
                                field: 'date',
                                headerName: 'Création',
                            },
                            {
                                field: 'username',
                                headerName: 'Nom d\'utilisateur',
                            },
                            {
                                field: 'phone',
                                headerName: 'Mobile',
                            },
                            {
                                field: 'email',
                                headerName: 'E-mail',
                            },
                            {
                                field: 'type',
                                headerName: 'Type',
                            },
                            {
                                field: 'password',
                                headerName: 'Mot de passe',
                                width: 150,
                                renderCell(params) {
                                    return (<FormControl sx={{ m: 1, margin: '0px', padding: '0px' }} variant="standard">
                                        <InputLabel>Mot de passe</InputLabel>
                                        <Input
                                            type={showPassword[params.row.index] ? 'text' : 'password'}

                                            onChange={(event) => {
                                                params.row.password = event.target.value;
                                                setStateTrigger(!stateTrigger);
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleClickShowPassword(params.row.index)}
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
                            {
                                field: 'wilayat',
                                headerName: 'Wilayat',
                                width: 200,
                                renderCell(params) {
                                    return params.row.type === 'Superviseur' ? (
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end', height: '60px', margin: '0px', padding: '0px' }}>
                                            <p style={{ fontSize: '17px', fontWeight: '500' }}>
                                                Accès total
                                            </p>
                                        </div>
                                    ) : (
                                        <FormControl sx={{ m: 1, width: 200, margin: '0px', padding: '0px' }} size="small">
                                            <InputLabel >Wilayat</InputLabel>
                                            <Select
                                                multiple
                                                value={(params.row.wilayas as any[]).map<string>((w: any) => w.name?.toLowerCase() ?? '')}
                                                onChange={(event) => handleChange((event.target.value as string[]), params.row.index)}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => selected.map((e: any) => e.charAt(0).toUpperCase() + e.slice(1)).join(',')}
                                            >
                                                {wilayas.map((wilaya) => (
                                                    <MenuItem key={wilaya.id} value={wilaya.name?.toLowerCase()}>
                                                        <Checkbox checked={params.row.wilayas?.some((w: any) => w.name?.toLowerCase() === wilaya.name?.toLowerCase())} />
                                                        <ListItemText primary={wilaya.name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    );
                                },
                            },
                            {
                                field: 'isBlocked',
                                headerName: 'Blocage',
                                width: 100,
                                renderCell(params) {
                                    return (<Switch onChange={() => {
                                        params.row.isBlocked = !params.row.isBlocked;
                                        setStateTrigger(!stateTrigger);
                                    }} checked={params.row.isBlocked} />);
                                }
                            },
                            {
                                field: 'edit',
                                headerName: 'Modifier',
                                renderCell(params) {
                                    return (<Button onClick={() => {
                                        editUser(params.row.user.clone());
                                    }} variant="text"><EditIcon /></Button>);
                                },
                            },

                        ]}
                        hidePaginationFooter={true}
                    />)}

        </div>
    );
};

export default ProfileTable;
