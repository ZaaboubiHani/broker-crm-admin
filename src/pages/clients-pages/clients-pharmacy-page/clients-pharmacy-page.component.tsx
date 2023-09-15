import MonthYearPicker from '../../../components/month-year-picker/month-year-picker.component';
import { Component } from 'react';
import '../clients-pharmacy-page/clients-pharmacy-page.style.css';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../../services/user.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CommandService from '../../../services/command.service';
import CommandModel from '../../../models/command.model';
import CommandPanel from '../../../components/comand-panel/command-panel.component';
import ReportModel from '../../../models/report.model';
import ClientsPharmacyTable from '../../../components/clients-pharmacy-table/clients-pharmacy-table.component';
import VisitModel from '../../../models/visit.model';
import VisitService from '../../../services/visit.service';
import ReportService from '../../../services/report.service';
import ReportPanel from '../../../components/report-panel/report-panel.component';

interface ClientsPharmacyPageProps {
    selectedDate: Date;
    hasData: boolean;
    isLoading: boolean;
    searchText: string;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    showReportPanel: boolean;
    visits: VisitModel[];
    filteredVisits: VisitModel[];
    selectedVisit?: VisitModel;
    reportData?: ReportModel;
    commandData?: CommandModel;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class ClientsPharmacyPage extends Component<{}, ClientsPharmacyPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            hasData: false,
            isLoading: false,
            searchText: '',
            visits: [],
            filteredVisits: [],
            loadingVisitsData: false,
            loadingReportData: false,
            showReportPanel: false,
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();
    commandService = new CommandService();

    handleDisplayReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, reportData: undefined, showReportPanel: true });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, reportData: report, selectedVisit: visit, showReportPanel: true });

    };

    handleDisplayCommand = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, commandData: undefined, showReportPanel: false });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({ loadingReportData: false, commandData: command, selectedVisit: visit, showReportPanel: false });
    };

    loadClientsPharmacyPageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var visits = await this.visitService.getAllVisitsMonth(new Date());
            this.setState({ isLoading: false, hasData: true, visits: visits });
        }

    };


    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, reportData: undefined });
        var visits = await this.visitService.getAllVisitsMonth(date);
        this.setState({ selectedDate: date, visits: visits, loadingVisitsData: false, filteredVisits: visits });
    }

    handleVisitsFilter = () => {
        this.setState({ reportData: undefined, commandData: undefined });
        if (this.state.searchText.length === 0) {
            var filteredVisits = [...this.state.visits];
            this.setState({ filteredVisits: filteredVisits });
        }
        else {
            var filteredVisits = this.state.visits.filter(visit => visit?.client?.name!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filteredVisits: filteredVisits });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    render() {

        if (!this.state.hasData) {
            this.loadClientsPharmacyPageData();
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
                <div className='clients-pharmacy-container' style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <div style={{display:'flex',height:'40px',marginLeft:'8px',marginTop:'8px'}}>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                            </Form.Group>
                        </Form>
                        <button onClick={this.handleVisitsFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px', margin: '0px 0px 0px 8px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </button>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1' }}>
                        <ClientsPharmacyTable id='clients-pharmacy-table' data={this.state.filteredVisits} isLoading={this.state.loadingVisitsData} displayCommand={this.handleDisplayCommand} displayReport={this.handleDisplayReport}></ClientsPharmacyTable>
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

                                        <ReportPanel report={this.state.reportData} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                    ) :
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

export default ClientsPharmacyPage;
