import UserModel from '../../models/user.model';
import { PRIMARY_COLOR, PRIMARY_COLOR_HIGHLIGHT } from '../../theme';
import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface UserDropdownProps {
    users: UserModel[];
    label: string;
    selectedUser?: UserModel;
    onSelectUser: (user: UserModel) => void;
}


const UserDropdown: React.FC<UserDropdownProps> = ({ users, label, onSelectUser, selectedUser }) => {

    return (<FormControl sx={{
        height: '40px',
        width: '150px',
        backgroundColor: 'white',
    }}>
        <InputLabel sx={{
            fontSize: '16px',
            lineHeight: '16px',
            marginTop: '-5px',
        }}>{label}</InputLabel>
        <Select
            sx={{
                height: '40px',
                width: '150px',
                backgroundColor: 'white',
            }}
            value={selectedUser}
            onChange={(event) => {
                let user = event.target.value as UserModel;
                onSelectUser(user);
            }}
        >
            {
                users.map((s) => (
                    <MenuItem value={s as any}>{s.username!}</MenuItem>
                ))
            }

        </Select>
    </FormControl>);
}


export default UserDropdown;