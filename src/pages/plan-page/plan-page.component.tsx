import React, { Component } from 'react';
import DatePickerBar from '../../components/date-picker/date-picker.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import '../plan-page/plan-page.style.css';
import ClientPicker from '../../components/user-picker/user-picker.component';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import PlanTable from '../../components/plan-table/plan-table.component';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserModel, { UserType } from '../../models/user.model';
import ReportModel from '../../models/report.model';
import VisitTaskModel from '../../models/visit-task.model';
import UserService from '../../services/user.service';
import { DotSpinner } from '@uiball/loaders';
import StatisticsService from '../../services/statics.service';
import PlanPanel from '../../components/plan-panel/plan-panel.component';
import VisitTaskService from '../../services/visit-task.service';
import TaskService from '../../services/task.service';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';
import TaskModel from '../../models/task.model';
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';
import ReportPanel from '../../components/report-panel/report-panel.component';
import VisitModel from '@/src/models/visit.model';
import UserDropdown from '../../components/user-dropdown/user-dropdown';

interface PlanPageProps {
    selectedDate: Date;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    delegateReport?: ReportModel;
    delegateVisit?: VisitModel;
    selectedDelegate?: UserModel;
    loadingVisitTasksData: boolean;
    isLoading: boolean;
    loadingReport: boolean;
    loadingVisitTaskDetails: boolean;
    visitTasks: VisitTaskModel[];
    visitTaskDetails: TaskModel[];
    selectedVisitTaskDate?: Date;
    planDeTournee: number;
    couverturePortfeuille: number;
    moyenneVisitesParJour: number;
    objectifChiffreDaffaire: number;
    objectifVisites: number;
    successRate: number;
    selectedIndex: number;
    currentUser: UserModel;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class PlanPage extends Component<{}, PlanPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            searchText: '',
            delegates: [],
            supervisors: [],
            loadingVisitTasksData: false,
            isLoading: true,
            loadingVisitTaskDetails: false,
            visitTasks: [],
            visitTaskDetails: [],
            planDeTournee: 0,
            couverturePortfeuille: 0,
            moyenneVisitesParJour: 0,
            objectifChiffreDaffaire: 0,
            objectifVisites: 0,
            successRate: 0,
            selectedIndex: -1,
            currentUser: new UserModel(),
            loadingReport: false,
        }
    }

    userService = new UserService();
    statisticsService = new StatisticsService();
    visitTaskService = new VisitTaskService();
    taskService = new TaskService();
    visitService = new VisitService();
    reportService = new ReportService();

    handleDisplayReport = async (clientId: number, date: Date, visit: VisitModel) => {
        this.setState({ loadingReport: true });
        let report = await this.reportService.getReportOfClient(clientId, date);
        this.setState({ loadingReport: false, delegateReport: report, delegateVisit: visit });
    }
    handleBackReportPanel = () => {
        this.setState({ loadingReport: false, delegateReport: undefined, delegateVisit: undefined });
    }


    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], selectedIndex: -1 });
        var visitTasks = await this.visitTaskService.getAllVisitsTasks(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, visitTasks: visitTasks, loadingVisitTasksData: false });
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegate.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegate.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegate.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegate.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegate.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegate.id!);

        this.setState({
            selectedDelegate: delegate,
            planDeTournee: planDeTournee,
            couverturePortfeuille: couverturePortfeuille,
            moyenneVisitesParJour: moyenneVisitesParJour,
            objectifChiffreDaffaire: objectifChiffreDaffaire,
            objectifVisites: objectifVisites,
            successRate: successRate,
        });
    }

    handleOnPickDate = async (date: Date) => {
        if (this.state.selectedDelegate) {
            this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], selectedIndex: -1 });
            var visitTasks = await this.visitTaskService.getAllVisitsTasks(date, this.state.selectedDelegate!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedDelegate!.id!);
            this.setState({ selectedDate: date, visitTasks: visitTasks, loadingVisitTasksData: false, });
            this.setState({
                selectedDate: date,
                planDeTournee: planDeTournee,
                couverturePortfeuille: couverturePortfeuille,
                moyenneVisitesParJour: moyenneVisitesParJour,
                objectifChiffreDaffaire: objectifChiffreDaffaire,
                objectifVisites: objectifVisites,
                successRate: successRate,
            });
        }
    }

    loadPlanPageData = async () => {

        var currentUser = await this.userService.getMe();

        if (currentUser != undefined) {
            this.setState({ currentUser: currentUser });
        }
        if (currentUser.type === UserType.supervisor) {
            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);

            this.setState({ isLoading: false, delegates: delegates, });
        }
        else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            this.setState({
                isLoading: false,

                supervisors: supervisors,
            });
        }


    };

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ delegates: [], selectedSupervisor: supervisor });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        this.setState({
            planDeTournee: 0,
            couverturePortfeuille: 0,
            moyenneVisitesParJour: 0,
            objectifChiffreDaffaire: 0,
            objectifVisites: 0,
            successRate: 0,
            visitTasks:[],
        });
        this.setState({  delegates: delegates, });
    }

    handleSelectVisitTaskDate = async (date: Date, index: number) => {
        this.setState({ loadingVisitTaskDetails: true, selectedIndex: index });
        var tasks = await this.taskService.getAllTasksOfDelegate(date, this.state.selectedDelegate!.id!);
        var visits = await this.visitService.getAllVisitsOfDelegateDay(date, this.state.selectedDelegate!.id!);
        tasks.forEach((task) => {
            if (visits.some(v => v.client?.id === task.client?.id)) {
                task.isDone = true;
                task.visit = visits.find((v) => v.client?.id === task.client?.id);
            }
        });
        this.setState({ visitTaskDetails: tasks, loadingVisitTaskDetails: false });
    };
    componentDidMount(): void {
        this.loadPlanPageData();
    }

    render() {
        if (this.state.isLoading) {
            this.loadPlanPageData();
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
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
                <div className='plan-container'>
                    <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>

                        {
                            this.state.currentUser.type === UserType.admin ?
                                (<div style={{
                                    height: '50px',
                                    width: '150px',
                                    marginLeft: '16px'
                                }}>
                                    <UserDropdown
                                        users={this.state.supervisors}
                                        selectedUser={this.state.selectedSupervisor}
                                        onSelectUser={this.handleSelectSupervisor}
                                        label='Superviseur'
                                    />
                                </div>) : null
                        }
                        <div style={{ height: '50px', width: '150px', margin: '0px 8px' }}>
                            <UserDropdown
                                users={this.state.delegates}
                                selectedUser={this.state.selectedDelegate}
                                onSelectUser={this.handleSelectDelegate}
                                label='Délégué'
                            />
                        </div>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div className='stats-panel' style={{ margin: '0px 8px 8px 16px', paddingLeft: '16px', backgroundColor: 'white' }}>
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
                        height: 'calc(100% - 220px)',
                       
                    }}>
                        <PlanTable onDisplayDetails={this.handleSelectVisitTaskDate} isLoading={this.state.loadingVisitTasksData} id='plantable' data={this.state.visitTasks}></PlanTable>
                        <div style={{
                            width: '30%',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            margin: '0px 0px 8px',
                            borderRadius: '4px',
                            flexGrow: '1',
                            display: 'flex',
                            border: '1px solid rgba(127,127,127,0.2)'
                        }}>
                            {
                                this.state.loadingReport ?
                                    (<div style={{
                                        width: '100%',
                                        overflow: 'hidden',
                                        flexGrow: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop:'8px',
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
                                    this.state.delegateReport ? (

                                        <ReportPanel onBackClick={this.handleBackReportPanel} showBackButton={true} location={this.state.delegateVisit?.visitLocation} report={this.state.delegateReport} clientType={this.state.delegateVisit?.client?.type}></ReportPanel>
                                    ) :
                                        (
                                            <PlanPanel onTaskClick={this.handleDisplayReport} isLoading={this.state.loadingVisitTaskDetails} data={this.state.visitTaskDetails}></PlanPanel>

                                        )
                            }
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default PlanPage;
