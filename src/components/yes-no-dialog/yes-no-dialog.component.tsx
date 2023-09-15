import React, { useState } from "react";
import '../add-client-dialog/add-client-dialog.style.css';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import { DialogActions } from "@mui/material";
import UserModel, { UserType } from "../../models/user.model";
import WilayaModel from "../../models/wilaya.model";

interface YesNoDialogProps {
    isOpen: boolean,
    message: string,
    onClose: (value: string) => void;
    onYes: () => void,
    onNo: () => void,
}


const YesNoDialog: React.FC<YesNoDialogProps> = ({isOpen,message,onClose,onNo,onYes}) => {

    const handleClose = () => {
        onClose('selectedValue');
    };

    return (
        <Dialog fullWidth={true} maxWidth='sm' onClose={handleClose} open={isOpen} >
            <DialogTitle>{message}</DialogTitle>
           
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button onClick={()=>onYes()} variant="contained" disableElevation>
                    Oui
                </Button>
                <Button onClick={()=>onNo()} variant="contained" disableElevation>
                    Non
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default YesNoDialog;