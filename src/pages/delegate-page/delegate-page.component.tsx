import React, { Component } from 'react';
import DatePickerBar from '../../components/date-picker/date-picker.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import '../delegate-page/delegate-page.style.css';
import ClientPicker from '../../components/user-picker/user-picker.component';
import DelegateTable from '../../components/delegate-table/delegate-table.component';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserModel from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../services/user.service';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';
import CommandService from '../../services/command.service';
import VisitModel from '../../models/visit.model';
import ReportModel from '../../models/report.model';
import CommandModel from '../../models/command.model';
import ReportPanel from '../../components/report-panel/report-panel.component';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import StatisticsService from '../../services/statics.service';




interface DelegatePageState {
    selectedDate: Date;
    visits: VisitModel[];
    delegates: UserModel[];
    selectedDelegate?: UserModel;
    filtredDelegates: UserModel[];
    selectedReport?: ReportModel;
    selectedCommand?: CommandModel;
    selectedVisit?: VisitModel;
    isLoading: boolean;
    hasData: boolean;
    loadingReportData: boolean;
    loadingVisitsData: boolean;
    searchText: string;
    showReportPanel: boolean;
    planDeTournee: number;
    couverturePortfeuille: number;
    moyenneVisitesParJour: number;
    objectifChiffreDaffaire: number;
    objectifVisites: number;
}

class DelegatePage extends Component<{}, DelegatePageState> {
    constructor() {
        super({});
        this.state = {
            selectedDate: new Date(),
            visits: [],
            delegates: [],
            filtredDelegates: [],
            selectedDelegate: new UserModel(),
            isLoading: false,
            showReportPanel: true,
            loadingReportData: false,
            loadingVisitsData: false,
            hasData: false,
            searchText: '',
            planDeTournee: 0,
            couverturePortfeuille: 0,
            moyenneVisitesParJour: 0,
            objectifChiffreDaffaire: 0,
            objectifVisites: 0,
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();
    commandService = new CommandService();
    statisticsService = new StatisticsService();

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



    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined });
        var visits = await this.visitService.getAllVisitsOfDelegate(date, this.state.selectedDelegate!.id!);
        var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDate: date, visits: visits, loadingVisitsData: false, planDeTournee: planDeTournee, couverturePortfeuille: couverturePortfeuille, moyenneVisitesParJour: moyenneVisitesParJour, objectifChiffreDaffaire: objectifChiffreDaffaire, objectifVisites: objectifVisites });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined });
        var visits = await this.visitService.getAllVisitsOfDelegate(this.state.selectedDate, delegate.id!);
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegate.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegate.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegate.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegate.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, visits: visits, loadingVisitsData: false, planDeTournee: planDeTournee, couverturePortfeuille: couverturePortfeuille, moyenneVisitesParJour: moyenneVisitesParJour, objectifChiffreDaffaire: objectifChiffreDaffaire, objectifVisites: objectifVisites });
    }

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

    loadDelegatePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {

            var delegates = await this.userService.getDelegateUsers();
            if (delegates.length > 0) {
                this.setState({ selectedDelegate: delegates[0] });
                var visits = await this.visitService.getAllVisitsOfDelegate(this.state.selectedDate, delegates[0].id!);
                var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegates[0].id!);
                var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegates[0].id!);
                var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegates[0].id!);
                var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegates[0].id!);
                var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegates[0].id!);
                this.setState({ visits: visits, loadingVisitsData: false, planDeTournee: planDeTournee, couverturePortfeuille: couverturePortfeuille, moyenneVisitesParJour: moyenneVisitesParJour, objectifChiffreDaffaire: objectifChiffreDaffaire, objectifVisites: objectifVisites });
            }
            this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
        }
    };

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    render() {
        if (!this.state.hasData) {
            this.loadDelegatePageData();
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
                <div className='delegate-container'>
                    <div className='search-bar'>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                            </Form.Group>
                        </Form>
                        <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div className='stats-panel' style={{ margin: '0px' }}>
                        <h2 className='labels'>KPI: Realisation plan de tournee: {this.state.planDeTournee.toFixed(3)}%</h2>
                        <h2 className='labels'>Couverture portefeuille client: {this.state.couverturePortfeuille.toFixed(3)}%</h2>
                        <h2 className='labels'>Objectif chiffre d'affaire: {this.state.objectifChiffreDaffaire}%</h2>
                        <h2 className='labels'>Objectif visites: {this.state.objectifVisites.toFixed(3)}%</h2>
                        <h2 className='labels'>Moyen visite/jour: {this.state.moyenneVisitesParJour.toFixed(3)}</h2>
                    </div>
                    <div className='table-panel' key={0}>
                        <DelegateTable id='delegatetable' isLoading={this.state.loadingVisitsData} data={this.state.visits} onDisplayCommand={this.handleDisplayCommand} onDisplayReport={this.handleDisplayReport}></DelegateTable>
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


export default DelegatePage;
