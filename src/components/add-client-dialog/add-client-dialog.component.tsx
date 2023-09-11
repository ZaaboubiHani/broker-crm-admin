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

interface AddClientDialogProps {
    isOpen: boolean,
    onClose: (value: string) => void;
    onAdd: (user: UserModel) => void,
}


const AddClientDialog: React.FC<AddClientDialogProps> = (props: AddClientDialogProps) => {
    const [userWilayas, setUserWilayas] = React.useState<string[]>([]);


    // const wilayas: {id:number,name:string}[] = [
    //     "Adrar",
    //     "Chlef",
    //     "Laghouat",
    //     "Oum El Bouaghi",
    //     "Batna",
    //     "Béjaïa",
    //     "Biskra",
    //     "Béchar",
    //     "Blida",
    //     "Bouira",
    //     "Tamanrasset",
    //     "Tébessa",
    //     "Tlemcen",
    //     "Tiaret",
    //     "Tizi Ouzou",
    //     "Alger",
    //     "Djelfa",
    //     "Jijel",
    //     "Sétif",
    //     "Saïda",
    //     "Skikda",
    //     "Sidi Bel Abbès",
    //     "Annaba",
    //     "Guelma",
    //     "Constantine",
    //     "Médéa",
    //     "Mostaganem",
    //     "M'Sila",
    //     "Mascara",
    //     "Ouargla",
    //     "Oran",
    //     "El Bayadh",
    //     "Illizi",
    //     "Bordj Bou Arréridj",
    //     "Boumerdès",
    //     "El Tarf",
    //     "Tindouf",
    //     "Tissemsilt",
    //     "El Oued",
    //     "Khenchela",
    //     "Souk Ahras",
    //     "Tipaza",
    //     "Mila",
    //     "Aïn Defla",
    //     "Naama",
    //     "Aïn Témouchent",
    //     "Ghardaïa",
    //     "Relizane"
    // ];
    const wilayas: WilayaModel[] = [
        { id: 3, name: "Adrar" },
        { id: 2, name: "Alger" },
        { id: 1, name: "Batna" },
    ];



    const [user, setUser] = useState<UserModel>(new UserModel({ type: UserType.delegate }));

    const { onClose, isOpen, onAdd } = props;


    if (!isOpen) return null;

    const handleAddUser = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (user != undefined) {
            onAdd(user);
        }
    }

    const handleWilayaChange = (event: SelectChangeEvent<typeof userWilayas>) => {

        const {
            target: { value },
        } = event;

        setUserWilayas(
            typeof value === 'string' ? [] : value,
        );

        var names = typeof value === 'string' ? [] : value;

        user.wilayas = [];

        for (let i = 0; i < names.length; i++) {
            var wilaya = wilayas.find((w) => w.name === names[i]);
            if (wilaya) {
                user.wilayas.push(wilaya)
            }
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        const {
            target: { value },
        } = event;
        user.type = typeof value === 'string' ? 3 : value;
    };

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
        user.username = event.target.value;
    }

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
        user.email = event.target.value;
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        user.password = event.target.value;
    }

    const handlePhone01 = (event: React.ChangeEvent<HTMLInputElement>): void => {
        user.phoneOne = event.target.value;
    }

    const handleClose = () => {
        onClose('selectedValue');
    };

    return (
        <Dialog fullWidth={true} maxWidth='sm' onClose={handleClose} open={isOpen} >
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogContent>
                <Box sx={{ flexGrow: 1, width: '550px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField onChange={handleUsername} id="standard-basic" label="Nom d'utilisateur" variant="standard" />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField onChange={handleEmail} id="standard-basic" label="Email" variant="standard" type="email" />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField onChange={handlePassword} id="standard-basic" label="Mot de passe" variant="standard" type="password" />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField onChange={handlePhone01} id="standard-basic" label="téléphone" variant="standard" type="phone" />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ flexGrow: '1', width: '100%' }}>
                                <InputLabel id="demo-multiple-checkbox-label">Wilayat</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={userWilayas}
                                    onChange={handleWilayaChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {wilayas.map((wilaya) => (
                                        <MenuItem key={wilaya.id} value={wilaya.name}>
                                            <Checkbox checked={userWilayas.indexOf(wilaya.name ?? '') > -1} />
                                            <ListItemText primary={wilaya.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">type d'utilisateur</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={3}
                                    label="type d'utilisateur"
                                    onChange={handleTypeChange}
                                >
                                    <MenuItem value={2}>Superviseur</MenuItem>
                                    <MenuItem value={3}>Délégué</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleAddUser} variant="contained" disableElevation>
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddClientDialog;