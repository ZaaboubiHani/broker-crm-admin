import React, { Component } from 'react';
import '../command-delegate-page/command-delegate-page.style.css';
import SearchBar from '../../../components/search-bar/search-bar.component';
import MonthYearPicker from '../../../components/month-year-picker/month-year-picker.component';
import CommandDelegateTable from '../../../components/command-delegate-table/command-delegate-table.component';
import { DotSpinner } from '@uiball/loaders';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserService from '../../../services/user.service';
import CommandService from '../../../services/command.service';
import UserModel from '../../../models/user.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../../components/user-picker/user-picker.component';
import CommandModel from '../../../models/command.model';
import CommandPanel from '../../../components/comand-panel/command-panel.component';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CommandDelegatePageProps {
    selectedDate: Date;
    hasData: boolean;
    isLoading: boolean;
    showDialog: boolean;
    dialogMessage: string;
    loadingCommandsData: boolean;
    commands: CommandModel[];
    commandData?: CommandModel;
    searchText: string;
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    loadingCommandData?: boolean;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class CommandDelegatePage extends Component<{}, CommandDelegatePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            searchText: '',
            dialogMessage: '',
            hasData: false,
            isLoading: false,
            showDialog: false,
            loadingCommandsData: false,
            commands: [],
            delegates: [],
            filtredDelegates: [],
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
        if (this.state.searchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingCommandsData: true, commandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, commands: commands, loadingCommandsData: false, });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingCommandsData: true, commandData: undefined });
        var commands = await this.commandService.getAllCommandsOfDelegate(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDate: date, commands: commands, loadingCommandsData: false, });
    }

    loadCommandDelegatePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var delegates = await this.userService.getDelegateUsers();
            if (delegates.length > 0) {
                this.setState({ selectedDelegate: delegates[0] });
                var commands = await this.commandService.getAllCommandsOfDelegate(new Date(), delegates[0].id!);
                this.setState({ commands: commands });
            }
            this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
        }
    }

    handleDisplayCommand = async (command: CommandModel) => {
        this.setState({ commandData: command });
    }

    handleHonorCommand = async (command: CommandModel) => {
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

    render() {

        if (!this.state.hasData) {
            this.loadCommandDelegatePageData();
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
                <div className='command-delegate-container'>
                    <div className='search-bar'>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                            </Form.Group>
                        </Form>
                        <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </button>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div style={{ display: 'flex', height: '48px' }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                    </div>
                    <div className='table-panel' key={0}>
                        <CommandDelegateTable id='command-delegate-table'
                            data={this.state.commands}
                            isLoading={this.state.loadingCommandsData}
                            displayCommand={this.handleDisplayCommand}
                            onHonor={this.handleHonorCommand}
                        ></CommandDelegateTable>
                        <div className='user-panel'>
                            {
                                this.state.loadingCommandData ?
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
                                        <CommandPanel command={this.state.commandData} ></CommandPanel>
                                    )
                            }
                        </div>
                    </div>
                    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.state.showDialog} autoHideDuration={3000} onClose={this.handleCloseDialog} message={this.state.dialogMessage} />
                </div>
            );
        }
    }
}

export default CommandDelegatePage;


