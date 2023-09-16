import MonthYearPicker from '../../../components/month-year-picker/month-year-picker.component';
import { Component } from 'react';
import '../command-cam-page/command-cam-page.style.css';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommandCamTable from '../../../components/command-cam-table/command-cam-table.component';
import { DotSpinner } from '@uiball/loaders';
import UserModel from '../../../models/user.model';
import UserService from '../../../services/user.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../../components/user-picker/user-picker.component';
import CommandService from '../../../services/command.service';
import CommandModel from '../../../models/command.model';
import CommandPanel from '../../../components/comand-panel/command-panel.component';

interface CommandCamPageProps {
    selectedDate: Date;
    hasData: boolean;
    isLoading: boolean;
    loadingCommandsData: boolean;
    searchText: string;
    commands: CommandModel[];
    commandData?: CommandModel;
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    loadingCommandData?: boolean;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class CommandCamPage extends Component<{}, CommandCamPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            hasData: false,
            isLoading: false,
            loadingCommandsData: false,
            searchText: '',
            commands: [],
            delegates: [],
            filtredDelegates: [],
        }
    }

    userService = new UserService();
    commandService = new CommandService();

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

    loadCommandCamPageData = async () => {
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

    render() {

        if (!this.state.hasData) {
            this.loadCommandCamPageData();
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
                <div className='command-cam-container'>
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
                    <div style={{ display: 'flex',height:'48px' }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                    </div>
                    <div className='table-panel' key={0}>
                        <CommandCamTable id='command-cam-table' data={this.state.commands} isLoading={this.state.loadingCommandsData} displayCommand={this.handleDisplayCommand}></CommandCamTable>
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
                </div>
            );
        }
    }
}

export default CommandCamPage;
