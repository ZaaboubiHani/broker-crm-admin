import React, { Component } from 'react';
import '../config-page/config-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import SearchBar from '../../components/search-bar/search-bar.component';

import Form from 'react-bootstrap/esm/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserService from '../../services/user.service';
import UserModel from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ConfigService from '../../services/statics.service';
import YearPicker from '../../components/year-picker/year-picker.component';
import SpecialityModel from '../../models/speciality.model';
import SpecialityService from '../../services/speciality.service';
import Button from '@mui/material/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider/Divider';
import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface ConfigPageProps {
    isLoading: boolean;
    hasData: boolean;
    medicalSpecialities: SpecialityModel[];
}

class ConfigPage extends Component<{}, ConfigPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            hasData: false,
            isLoading: false,
            medicalSpecialities: [],
        }
    }
    specialityService = new SpecialityService();

    loadConfigPageData = async () => {

        this.setState({ isLoading: true });

        if (!this.state.isLoading) {
            // var specialities = await this.specialityService.getAllMedicalSpecialities();
            // this.setState({ isLoading: false, hasData: true, medicalSpecialities: specialities });
            this.setState({ isLoading: false, hasData: true, });
        }
    }


    render() {
        if (!this.state.hasData) {
            this.loadConfigPageData();
            return (
                <div style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <DotSpinner
                        size={40}
                        speed={0.9}
                        color="black"
                    />
                </div>
            );
        }
        else {
            return (
                <div className='config-container'>
                    <div style={{ display: 'flex', width: '100%', height: '450px', marginTop: '8px' }}>
                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                <TextField size="small" id="outlined-basic" label="Nom de spécialité" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                <IconButton sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div style={{ padding: '0px 16px 0px 0px' }}>
                                <Table sx={{ width: '100%', borderRadius: '4px' }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nom de spécialité </TableCell>
                                            <TableCell align="right">Supprimer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.medicalSpecialities.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">
                                                    <IconButton >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                <TextField size="small" id="outlined-basic" label="Contenu du commentaire" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                <IconButton sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div style={{ padding: '0px 16px 0px 0px' }}>
                                <Table sx={{ width: '100%', borderRadius: '4px' }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Contenu du commentaire</TableCell>
                                            <TableCell align="right">Supprimer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.medicalSpecialities.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">
                                                    <IconButton >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid grey 1px' }} />
                        <div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', width: '100%', padding: '8px 8px 0px 8px' }}>
                                <TextField size="small" id="outlined-basic" label="Nom de motivation" variant="outlined" sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                <IconButton sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div style={{ padding: '0px 16px 0px 0px' }}>
                                <Table sx={{ width: '100%', borderRadius: '4px' }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nom de motivation </TableCell>
                                            <TableCell align="right">Supprimer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.medicalSpecialities.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">
                                                    <IconButton >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                    <div style={{ width: '100%', display: 'flex', maxHeight: '450px' }}>
                        <div style={{ width: '40%', margin: '8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                            <h4>
                                Configuration des fournisseurs
                            </h4>
                            <div style={{ display: 'flex', margin: '8px 0px' }}>
                                <TextField size="small" id="outlined-basic" label="Nom de fournisseur" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                <TextField size="small" id="outlined-basic" label="Numéro de téléphone" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                            </div>
                            <div style={{ display: 'flex', margin: '16px 0px' }}>
                                <FormControl sx={{ marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                    <InputLabel id="demo-select-small-label">Wilaya</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={10}
                                        label="Age"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Batna</MenuItem>
                                        <MenuItem value={20}>Alger</MenuItem>
                                        <MenuItem value={30}>Adrar</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                    <InputLabel id="demo-select-small-label">Commune</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={10}
                                        label="Age"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Batna</MenuItem>
                                        <MenuItem value={20}>Alger</MenuItem>
                                        <MenuItem value={30}>Adrar</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: 'flex', margin: '16px 0px 0px 0px' }}>
                                <FormControl sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} size="small">
                                    <InputLabel id="demo-select-small-label">Type</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={0}
                                        label="Age"
                                    >
                                        <MenuItem value={0}>Pharmacétique</MenuItem>
                                        <MenuItem value={1}>Parapharmacétique</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button startIcon={<AddIcon />} sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                                    Ajouter
                                </Button>
                            </div>
                        </div>
                        <div style={{ width: '60%', padding: '8px' }}>
                            <Table sx={{ width: '100%', borderRadius: '4px', margin: '0px' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom de motivation </TableCell>
                                        <TableCell align="right">Supprimer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.medicalSpecialities.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="left">
                                                <IconButton >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <Divider component="div" style={{ margin: '0px 16px' }} sx={{ borderBottom: 'solid grey 1px' }} />
                    <div style={{ width: '100%', maxHeight: '450px' }}>
                        <div style={{ width: '40%', margin: '8px', backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
                            <h4>
                                Configuration des chiffres d'affaires
                            </h4>
                            <div style={{ display: 'flex', marginTop: '8px' }}>
                                <TextField size="small" id="outlined-basic" label="Prix de nuit" variant="outlined" sx={{ marginRight: '16px', backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                                <TextField size="small" id="outlined-basic" label="km Prix" variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '4px', height: '40px', flexGrow: '1' }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ConfigPage;