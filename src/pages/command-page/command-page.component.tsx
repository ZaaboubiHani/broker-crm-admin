import React, { Component } from 'react';
import '../command-page/command-page.style.css';
import SearchBar from '../../components/search-bar/search-bar.component';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import CommandDelegateTable from '../../components/command-delegate-table/command-delegate-table.component';
import { DotSpinner } from '@uiball/loaders';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserService from '../../services/user.service';
import CommandService from '../../services/command.service';
import UserModel, { UserType } from '../../models/user.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import CommandModel from '../../models/command.model';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import CommandCamTable from '../../components/command-cam-table/command-cam-table.component';

interface CommandDelegatePageProps {
    selectedDateDelegate: Date;
    selectedDateKam: Date;
    hasData: boolean;
    isLoading: boolean;
    showDialog: boolean;
    dialogMessage: string;
    loadingDelegateCommandsData: boolean;
    loadingKamCommandsData: boolean;
    delegateCommands: CommandModel[];
    kamCommands: CommandModel[];
    delegateCommandData?: CommandModel;
    kamCommandData?: CommandModel;
    delegateSearchText: string;
    kamSearchText: string;
    delegates: UserModel[];
    kams: UserModel[];
    filtredDelegates: UserModel[];
    filtredKams: UserModel[];
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    selectedDelegate?: UserModel;
    selectedKam?: UserModel;
    loadingDelegateCommandData?: boolean;
    loadingKamCommandData?: boolean;
    index: number,
    currentUser: UserModel;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class CommandPage extends Component<{}, CommandDelegatePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            supervisors: [],
            selectedDateDelegate: new Date(),
            selectedDateKam: new Date(),
            delegateSearchText: '',
            kamSearchText: '',
            dialogMessage: '',
            hasData: false,
            isLoading: false,
            showDialog: false,
            loadingDelegateCommandsData: false,
            loadingKamCommandsData: false,
            delegateCommands: [],
            kamCommands: [],
            delegates: [],
            kams: [],
            filtredDelegates: [],
            filtredKams: [],
            index: 0,
        }
    }

    userService = new UserService();
    commandService = new CommandService();

    handleCloseDialog = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ showDialog: false, });
    };

    handleDelegateFilter = () => {
        if (this.state.delegateSearchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.delegateSearchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates });
        }
    }
    handleKamFilter = () => {
        if (this.state.kamSearchText.length === 0) {
            var filtredKams = [...this.state.kams];
            this.setState({ filtredKams: filtredKams });
        }
        else {
            var filtredKams = this.state.kams.filter(kam => kam.username!.toLowerCase().includes(this.state.kamSearchText.toLowerCase()));
            this.setState({ filtredKams: filtredKams });
        }
    }

    handleDelegateSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ delegateSearchText: event.target.value });
    }

    handleKamSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ kamSearchText: event.target.value });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(this.state.selectedDateDelegate, delegate.id!);
        this.setState({ selectedDelegate: delegate, delegateCommands: commands, loadingDelegateCommandsData: false, });
    }
    handleSelectKam = async (kam: UserModel) => {
        this.setState({ loadingKamCommandsData: true, kamCommandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(this.state.selectedDateKam, kam.id!);
        this.setState({ selectedKam: kam, kamCommands: commands, loadingKamCommandsData: false, });
    }

    handleOnPickDateDelegate = async (date: Date) => {
        this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDateDelegate: date, delegateCommands: commands, loadingDelegateCommandsData: false, });
    }

    handleOnPickDateKam = async (date: Date) => {
        this.setState({ loadingKamCommandsData: true, kamCommandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDateKam: date, kamCommands: commands, loadingKamCommandsData: false, });
    }

    loadCommandPageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var currentUser = await this.userService.getMe();
            if (currentUser != undefined) {
                this.setState({ currentUser: currentUser });
            }

            if (currentUser.type === UserType.supervisor) {
                var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);
                if (delegates.length > 0) {
                    this.setState({ selectedDelegate: delegates[0] });
                    var commands = await this.commandService.getAllCommandsOfDelegate(new Date(), delegates[0].id!);
                    this.setState({ delegateCommands: commands });
                }
                this.setState({ currentUser: currentUser, isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
                this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
            } else {
                var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
                var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);
                if (supervisors.length > 0) {
                    var delegates = await this.userService.getUsersByCreator(supervisors[0].id!, UserType.delegate);
                    if (delegates.length > 0) {
                        this.setState({ selectedDelegate: delegates[0] });
                        var commands = await this.commandService.getAllCommandsOfDelegate(new Date(), delegates[0].id!);
                        this.setState({ delegateCommands: commands });
                    }
                    this.setState({ currentUser: currentUser, isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
                    this.setState({
                        isLoading: false,
                        delegates: delegates,
                        filtredDelegates: delegates,
                        hasData: true,
                        selectedSupervisor: supervisors[0]
                    });

                }
                this.setState({
                    isLoading: false,
                    hasData: true,
                    supervisors: supervisors, 
                    kams: kams,
                    filtredKams: kams
                });
            }

        }
    }

    handleDisplayDelegateCommand = async (command: CommandModel) => {
        this.setState({ delegateCommandData: command });
    }

    handleDisplayKamCommand = async (command: CommandModel) => {
        this.setState({ kamCommandData: command });
    }

    handleHonorDelegateCommand = async (command: CommandModel) => {
        if (command.isHonored && command.finalSupplier !== undefined) {
            await this.commandService.honorCommand(command!.id!, command!.finalSupplier!.id!);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande honoré' });
        }
        else if (command.isHonored && command.finalSupplier === undefined) {
            this.setState({ showDialog: true, dialogMessage: 'Vous ne pouvez pas honorer sans un fournisseur' });
        }
        else if (!command.isHonored) {
            await this.commandService.dishonorCommand(command!.id!);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande dishonoré' });
        }
    }

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined, delegates: [], filtredDelegates: [] });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        if (delegates.length > 0) {
            this.setState({ selectedDelegate: delegates[0] });
            var commands = await this.commandService.getAllCommandsOfDelegate(new Date(), delegates[0].id!);
            this.setState({ delegateCommands: commands });
        }
        this.setState({ delegates: delegates, filtredDelegates: delegates, loadingDelegateCommandsData: false });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    render() {

        if (!this.state.hasData) {
            this.loadCommandPageData();
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '50px' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Délégués" />
                                {
                                    this.state.currentUser.type === UserType.admin ? (<Tab label="Kam" />) : null
                                }

                            </Tabs>
                        </Box>
                    </Box>
                    <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)',padding:'0px' }} value={this.state.index} index={0} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)' }}>
                            {
                                this.state.currentUser.type === UserType.admin ? (<div style={{ display: 'flex' }}>
                                    <UserPicker delegates={this.state.supervisors} onSelect={this.handleSelectSupervisor}></UserPicker>
                                </div>) : null
                            }
                            <div  style={{ display: 'flex', height: '40px', marginLeft: '8px', marginTop: '0px' }}>
                                <Form>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Control type="search" placeholder="Recherche" onChange={this.handleDelegateSearchTextChange} />
                                    </Form.Group>
                                </Form>
                                <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                    <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                </button>
                                <MonthYearPicker onPick={this.handleOnPickDateDelegate}></MonthYearPicker >
                            </div>
                            <div style={{ display: 'flex', height: '55px' }}>
                                <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                            </div>
                            <div className='table-panel' key={0}>
                                <CommandDelegateTable id='command-delegate-table'
                                    data={this.state.delegateCommands}
                                    isLoading={this.state.loadingDelegateCommandsData}
                                    displayCommand={this.handleDisplayDelegateCommand}
                                    onHonor={this.handleHonorDelegateCommand}
                                ></CommandDelegateTable>
                                <div className='user-panel'>
                                    {
                                        this.state.loadingDelegateCommandData ?
                                            (<div style={{
                                                width: '100%',
                                                overflow: 'hidden',
                                                flexGrow: '1',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'all 300ms ease'
                                            }}>
                                                <DotSpinner
                                                    size={40}
                                                    speed={0.9}
                                                    color="black"
                                                />
                                            </div>
                                            )
                                            :
                                            (
                                                <CommandPanel command={this.state.delegateCommandData} ></CommandPanel>
                                            )
                                    }
                                </div>
                            </div>
                            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.state.showDialog} autoHideDuration={3000} onClose={this.handleCloseDialog} message={this.state.dialogMessage} />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)' }} value={this.state.index} index={1} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)' }}>
                            <div className='search-bar'>
                                <Form>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Control type="search" placeholder="Recherche" onChange={this.handleKamSearchTextChange} />
                                    </Form.Group>
                                </Form>
                                <button onClick={this.handleKamFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                    <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                </button>
                                <MonthYearPicker onPick={this.handleOnPickDateKam}></MonthYearPicker >
                            </div>
                            <div style={{ display: 'flex', height: '48px' }}>
                                <UserPicker delegates={this.state.filtredKams} onSelect={this.handleSelectKam}></UserPicker>
                            </div>
                            <div className='table-panel' key={0}>
                                <CommandCamTable id='command-cam-table' data={this.state.kamCommands} isLoading={this.state.loadingKamCommandsData} displayCommand={this.handleDisplayKamCommand}></CommandCamTable>
                                <div className='user-panel'>
                                    {
                                        this.state.loadingKamCommandData ?
                                            (<div style={{
                                                width: '100%',
                                                overflow: 'hidden',
                                                flexGrow: '1',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'all 300ms ease'
                                            }}>
                                                <DotSpinner
                                                    size={40}
                                                    speed={0.9}
                                                    color="black"
                                                />
                                            </div>
                                            )
                                            :
                                            (
                                                <CommandPanel command={this.state.kamCommandData} ></CommandPanel>
                                            )
                                    }
                                </div>
                            </div>

                        </div>
                    </CustomTabPanel>

                </div>

            );
        }
    }
}

export default CommandPage;


