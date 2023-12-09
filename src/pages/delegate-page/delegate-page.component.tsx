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
import UserModel, { UserType } from '../../models/user.model';
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
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';
import { ClientType } from '../../models/client.model';
import UserDropdown from '../../components/user-dropdown/user-dropdown';




interface DelegatePageState {
    selectedDate: Date;
    visits: VisitModel[];
    delegates: UserModel[];
    selectedDelegate?: UserModel;
    selectedReport?: ReportModel;
    selectedCommand?: CommandModel;
    selectedVisit?: VisitModel;
    isLoading: boolean;
    loadingReportData: boolean;
    loadingVisitsData: boolean;
    searchText: string;
    showReportPanel: boolean;
    planDeTournee: number;
    couverturePortfeuille: number;
    moyenneVisitesParJour: number;
    objectifChiffreDaffaire: number;
    objectifVisites: number;
    successRate: number;
    currentUser: UserModel;
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
}

class DelegatePage extends Component<{}, DelegatePageState> {
    constructor() {
        super({});
        this.state = {
            selectedDate: new Date(),
            currentUser: new UserModel(),
            supervisors: [],
            visits: [],
            delegates: [],
            isLoading: true,
            showReportPanel: true,
            loadingReportData: false,
            loadingVisitsData: false,
            searchText: '',
            planDeTournee: 0,
            couverturePortfeuille: 0,
            moyenneVisitesParJour: 0,
            objectifChiffreDaffaire: 0,
            objectifVisites: 0,
            successRate: 0,
            totalDelegate: 0,
            sizeDelegate: 25,
            delegatePage: 1,
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();
    commandService = new CommandService();
    statisticsService = new StatisticsService();

    handleDisplayReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, showReportPanel: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, selectedReport: report, selectedVisit: visit, showReportPanel: true });

    };

    handleDisplayCommand = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, showReportPanel: false, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({ loadingReportData: false, selectedCommand: command, selectedVisit: visit, showReportPanel: false });
    };

    handleOnPickDate = async (date: Date) => {
        if (this.state.selectedDelegate) {
            this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
            var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, date, this.state.selectedDelegate!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedDelegate!.id!);
            this.setState({
                selectedDate: date,
                visits: visits,
                planDeTournee: planDeTournee,
                couverturePortfeuille: couverturePortfeuille,
                moyenneVisitesParJour: moyenneVisitesParJour,
                objectifChiffreDaffaire: objectifChiffreDaffaire,
                objectifVisites: objectifVisites,
                successRate: successRate,
                loadingVisitsData: false,
                delegatePage: 1,
                totalDelegate: total,
            });
        }
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, this.state.sizeDelegate, this.state.selectedDate, delegate.id!);
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegate.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegate.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegate.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegate.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegate.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegate.id!);

        this.setState({
            selectedDelegate: delegate,
            visits: visits,
            loadingVisitsData: false,
            planDeTournee: planDeTournee,
            couverturePortfeuille: couverturePortfeuille,
            moyenneVisitesParJour: moyenneVisitesParJour,
            objectifChiffreDaffaire: objectifChiffreDaffaire,
            objectifVisites: objectifVisites,
            successRate: successRate,
            delegatePage: 1,
            totalDelegate: total,
        });
    }


    loadDelegatePageData = async () => {

        var currentUser = await this.userService.getMe();
        if (currentUser != undefined) {
            this.setState({ currentUser: currentUser });
        }
        if (currentUser.type === UserType.supervisor) {
            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);

            this.setState({ isLoading: false, delegates: delegates, });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);

            this.setState({
                isLoading: false,
                supervisors: supervisors
            });
        }


    };



    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({
            selectedReport: undefined,
            selectedCommand: undefined,
            selectedVisit: undefined,
            delegates: [],
            visits: [],
        });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);


        this.setState({ delegates: delegates, });
    }

    handleDelegatePageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, delegatePage: page, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(page, size, this.state.selectedDate, this.state.selectedDelegate!.id!);
        this.setState({ visits: visits, loadingVisitsData: false, totalDelegate: total, sizeDelegate: size });
    }

    handleDelegateRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, delegatePage: 1, sizeDelegate: size, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, size, this.state.selectedDate, this.state.selectedDelegate!.id!);
        this.setState({ visits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    componentDidMount(): void {
        this.loadDelegatePageData();
    }

    render() {
        if (this.state.isLoading) {

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
                <div className='delegate-container' style={{ height: '100vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>

                        {
                            this.state.currentUser.type === UserType.admin ?
                                (<div style={{
                                    height: '50px',
                                    width: '150px',
                                    margin: '0px 8px'
                                }}>
                                    <UserDropdown
                                        users={this.state.supervisors}
                                        selectedUser={this.state.selectedSupervisor}
                                        onSelectUser={this.handleSelectSupervisor}
                                        label='Superviseur'
                                    />
                                </div>) : null
                        }
                        <div style={{ height: '50px', width: '150px', marginRight: '8px' }}>
                            <UserDropdown
                                users={this.state.delegates}
                                selectedUser={this.state.selectedDelegate}
                                onSelectUser={this.handleSelectDelegate}
                                label='Délégué'
                            />
                        </div>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div className='stats-panel' style={{ margin: '0px 8px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                        <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='KPI: Realisation plan de tournee' value={this.state.planDeTournee} />
                        <CircularProgressLabel colorStroke='#CC38E0' direction='row' secondTitle='Couverture portefeuille client' value={this.state.couverturePortfeuille} />
                        <CircularProgressLabel colorStroke='#38EB5D' direction='row' secondTitle="Objectif chiffre d'affaire" value={this.state.objectifChiffreDaffaire} />
                        <CircularProgressLabel colorStroke='#2FBCEB' direction='row' secondTitle='Objectif visites' value={this.state.objectifVisites * 100} />
                        <CircularProgressLabel colorStroke='#FC4630' direction='row' secondTitle='Moyen visite/jour' formatter={(val) => val.toFixed(0)} value={this.state.moyenneVisitesParJour} />
                        <CircularProgressLabel colorStroke='#3A25E6' direction='row' secondTitle='Taux de réussite' value={this.state.successRate} />
                    </div>
                    <div style={{
                        width: '100%',
                        flexGrow: '1',
                        display: 'flex',
                        height: 'calc(100% - 220px)'
                    }}>

                        <DelegateTable
                            id='delegatetable'
                            total={this.state.totalDelegate}
                            page={this.state.delegatePage}
                            size={this.state.sizeDelegate}
                            pageChange={this.handleDelegatePageChange}
                            isLoading={this.state.loadingVisitsData}
                            data={this.state.visits}
                            onDisplayCommand={this.handleDisplayCommand}
                            onDisplayReport={this.handleDisplayReport}
                        ></DelegateTable>
                        <div style={{
                            width: '30%',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            margin: '0px 0px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(127,127,127,0.2)'
                        }}>
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
                                        <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.selectedReport} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
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
