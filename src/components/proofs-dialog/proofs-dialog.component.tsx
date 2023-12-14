import React from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import { Card, CardActionArea, CardMedia, DialogActions } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToYYYYMMDD } from "../../functions/date-format";

interface ProofsDialogProps {
    isOpen: boolean,
    onClose: (value: string) => void;
    data: { date: Date, urls: string[] }[];
}


const ProofsDialog: React.FC<ProofsDialogProps> = ({ onClose, isOpen, data }) => {

    const handleClose = () => {
        onClose('selectedValue');
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Dialog fullWidth={true} maxWidth='lg' onClose={handleClose} open={isOpen} >
            <DialogTitle>Consulter piece jointes</DialogTitle>
            <DialogContent dividers={true}>

                {data.map(
                    (link) =>
                    (
                        <div>
                            <h4>
                                date: {formatDateToYYYYMMDD(link.date)}
                            </h4>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignContent: 'start',
                                width: '100%',
                            }}>
                                {
                                    link.urls.length === 0 ?
                                        (
                                            <div style={{ margin: '16px 8px', borderTop: 'solid #aaa 1px', width: "100%" }}>

                                            </div>
                                        ) :
                                        link.urls
                                            .map((url) => (
                                                <Card sx={{ maxWidth: 345, margin: '4px', borderRadius: '4px' }}>
                                                    <CardActionArea onClick={() => handleDownload(url)}>

                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={url}

                                                        />
                                                    </CardActionArea>
                                                </Card>
                                            ))
                                }
                            </div>
                        </div>
                    ),
                )
                }

            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleClose} variant="contained" disableElevation>
                    <CloseIcon />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProofsDialog;