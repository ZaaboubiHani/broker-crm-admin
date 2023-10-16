import React, { Component } from 'react';
import DatePickerBar from '../../components/date-picker/date-picker.component';
import '../home-page/home-page.style.css';
import UserPicker from '../../components/user-picker/user-picker.component';
import HomeTable from '../../components/home-table/home-table.component';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders'
import VisitService from '../../services/visit.service';
import VisitModel from '../../models/visit.model';
import ReportModel from '../../models/report.model';
import ReportService from '../../services/report.service';
import ReportPanel from '../../components/report-panel/report-panel.component';
import CommandModel from '../../models/command.model';
import CommandService from '../../services/command.service';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ClientType } from '../../models/client.model';


interface HomePageState {
    selectedDate: Date;
    user: UserModel;
    selectedReport?: ReportModel;
    selectedCommand?: CommandModel;
    selectedVisit?: VisitModel;
    isLoading: boolean;
    hasData: boolean;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    showReportPanel: boolean;
    visits: VisitModel[];
    filteredVisits: VisitModel[];
    searchText: string;
}

interface HomePageProps {

}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class HomePage extends Component<HomePageProps, HomePageState> {

    constructor(props: HomePageProps) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            user: new UserModel({}),
            isLoading: false,
            loadingVisitsData: false,
            loadingReportData: false,
            visits: [],
            filteredVisits: [],
            showReportPanel: true,
            hasData: false,
            searchText: '',
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();
    commandService = new CommandService();

    handleDisplayReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, selectedReport: undefined, showReportPanel: true });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, selectedReport: report, selectedVisit: visit, showReportPanel: true });

    };

    handleDisplayCommand = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, selectedReport: undefined, showReportPanel: false });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({ loadingReportData: false, selectedCommand: command, selectedVisit: visit, showReportPanel: false });
    };

    loadHomePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {

            var user = await this.userService.getMe();

            if (user != undefined) {
                this.setState({ user: user });
            }
            var visits: VisitModel[];
            if (user.type === UserType.supervisor) {
                visits = await this.visitService.getAllVisits(new Date(), ClientType.pharmacy);
            } else {
                visits = await this.visitService.getAllVisits(new Date(), ClientType.wholesaler);
            }
            this.setState({ isLoading: false, hasData: true, visits: visits, filteredVisits: visits });
        }

    };


    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined });
        var visits: VisitModel[];
        if (this.state.user.type === UserType.supervisor) {
            visits = await this.visitService.getAllVisits(date, ClientType.pharmacy);
        } else {
            visits = await this.visitService.getAllVisits(date, ClientType.wholesaler);
        }
        this.setState({ selectedDate: date, visits: visits, loadingVisitsData: false, filteredVisits: visits });
    }

    handleVisitsFilter = () => {
        this.setState({ selectedReport: undefined });
        if (this.state.searchText.length === 0) {
            var filteredVisits = [...this.state.visits];
            this.setState({ filteredVisits: filteredVisits });
        }
        else {
            var filteredVisits = this.state.visits.filter(visit => visit?.user?.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filteredVisits: filteredVisits });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    render() {
        if (!this.state.hasData) {
            this.loadHomePageData();
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
                <div style={{ backgroundColor: '#eee', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <DatePickerBar onPick={this.handleOnPickDate}></DatePickerBar>
                    <div className='search-bar' style={{ marginBottom: '8px' }}>
                        <TextField
                            label='Recherche par nom de délégué'
                            size="small"
                            onChange={this.handleSearchTextChange}
                            sx={{ width: '300px', marginRight: '8px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}
                        />
                        <Button onClick={this.handleVisitsFilter} variant='outlined' sx={{ border: 'solid grey 1px', backgroundColor: 'white', borderRadius: '4px', height: '40px', }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </Button>
                    </div>
                    <div className='table-panel'>
                        <HomeTable id='hometable'
                            isLoading={this.state.loadingVisitsData}
                            data={this.state.filteredVisits}
                            onDisplayReport={this.handleDisplayReport}
                            onDisplayCommand={this.handleDisplayCommand}
                        ></HomeTable>
                        <div className='user-panel'>
                            {
                                this.state.loadingReportData ?
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
                                    this.state.showReportPanel ? (

                                        <ReportPanel report={this.state.selectedReport} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                    ) :
                                        (
                                            <CommandPanel command={this.state.selectedCommand} ></CommandPanel>
                                        )
                            }

                        </div>
                    </div>
                </div>
            );
        }
    }
}



export default HomePage;

