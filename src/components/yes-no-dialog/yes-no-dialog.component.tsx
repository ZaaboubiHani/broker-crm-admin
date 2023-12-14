import React, { useState } from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from "@mui/material";

interface YesNoDialogProps {
    isOpen: boolean,
    message: string,
    onClose: (value: string) => void;
    onYes: () => void,
    onNo: () => void,
}


const YesNoDialog: React.FC<YesNoDialogProps> = ({ isOpen, message, onClose, onNo, onYes }) => {

    const handleClose = () => {
        onClose('selectedValue');
    };

    return (
        <Dialog fullWidth={true} maxWidth='sm' onClose={handleClose} open={isOpen} >
            <DialogTitle>{message}</DialogTitle>

            <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button onClick={() => onYes()} variant="contained" disableElevation>
                    Oui
                </Button>
                <Button onClick={() => onNo()} variant="contained" disableElevation>
                    Non
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default YesNoDialog;