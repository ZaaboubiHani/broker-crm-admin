import React, { Component } from 'react';
import '../plan-page/plan-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import PlanTable from '../../components/plan-table/plan-table.component';
import UserModel, { UserType } from '../../models/user.model';

import VisitTaskModel from '../../models/visit-task.model';
import UserService from '../../services/user.service';
import { DotSpinner } from '@uiball/loaders';
import StatisticsService from '../../services/statics.service';
import PlanPanel from '../../components/plan-panel/plan-panel.component';
import VisitTaskService from '../../services/visit-task.service';
import TaskService from '../../services/task.service';
import UserTrackingService from '../../services/user-tracking.service';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';
import TaskModel from '../../models/task.model';
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';
import ReportPanel from '../../components/report-panel/report-panel.component';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import MapDialog from '../../components/map-dialog/map-dialog.component';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { formatDateToYYYYMMDD, formatTime } from '../../functions/date-format';
import ReportModel from '../../models/report.model';
import VisitModel from '../../models/visit.model';
import UserTrackingModel from '@/src/models/user-tracking.model';

interface PlanPageProps {
    selectedDate: Date;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    kams: UserModel[];
    selectedSupervisor?: UserModel;
    selectedKam?: UserModel;
    delegateReport?: ReportModel;
    delegateVisit?: VisitModel;
    selectedDelegate?: UserModel;
    loadingVisitTasksData: boolean;
    isLoading: boolean;
    loadingReport: boolean;
    loadingMap: boolean;
    showMap: boolean;
    loadingDelegates: boolean;
    loadingVisitTaskDetails: boolean;
    delegateVisitTasks: VisitTaskModel[];
    kamVisitTasks: VisitTaskModel[];
    visitTaskDetails: TaskModel[];
    trackings: UserTrackingModel[];
    selectedVisitTaskDate?: Date;
    visitsCoordinates: { point: number[], name: string, time: string }[];
    tasksCoordinates: { point: number[], name: string }[];
    delegatePlanDeTournee: number;
    kamPlanDeTournee: number;
    delegateCouverturePortfeuille: number;
    kamCouverturePortfeuille: number;
    delegateMoyenneVisitesParJour: number;
    kamMoyenneVisitesParJour: number;
    delegateObjectifChiffreDaffaire: number;
    kamObjectifChiffreDaffaire: number;
    delegateObjectifVisites: number;
    kamObjectifVisites: number;
    delegateSuccessRate: number;
    kamSuccessRate: number;
    currentUser: UserModel;
    index: number;
}


class PlanPage extends Component<{}, PlanPageProps> {

    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            searchText: '',
            index: 0,
            delegates: [],
            supervisors: [],
            kams: [],
            loadingVisitTasksData: false,
            isLoading: true,
            loadingMap: false,
            loadingVisitTaskDetails: false,
            loadingDelegates: false,
            delegateVisitTasks: [],
            kamVisitTasks: [],
            visitTaskDetails: [],
            visitsCoordinates: [],
            tasksCoordinates: [],
            showMap: false,
            trackings:[],
            delegatePlanDeTournee: 0,
            kamPlanDeTournee: 0,
            delegateCouverturePortfeuille: 0,
            kamCouverturePortfeuille: 0,
            delegateMoyenneVisitesParJour: 0,
            kamMoyenneVisitesParJour: 0,
            delegateObjectifChiffreDaffaire: 0,
            kamObjectifChiffreDaffaire: 0,
            delegateObjectifVisites: 0,
            kamObjectifVisites: 0,
            delegateSuccessRate: 0,
            kamSuccessRate: 0,
            currentUser: new UserModel(),
            loadingReport: false,
        }
    }

    userService = UserService.getInstance();
    statisticsService = StatisticsService.getInstance();
    visitTaskService = VisitTaskService.getInstance();
    taskService = TaskService.getInstance();
    visitService = VisitService.getInstance();
    reportService = ReportService.getInstance();
    userTrackingService = UserTrackingService.getInstance();

    handleDisplayReport = async (clientId: number, date: Date, visit: VisitModel) => {
        this.setState({ loadingReport: true });
        let report = await this.reportService.getReportOfClient(clientId, date);
        this.setState({ loadingReport: false, delegateReport: report, delegateVisit: visit });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, delegateReport: undefined, visitTaskDetails: [] });
    };


    handleBackReportPanel = () => {
        this.setState({ loadingReport: false, delegateReport: undefined, delegateVisit: undefined });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], });
        var visitTasks = await this.visitTaskService.getAllVisitsTasks(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, delegateVisitTasks: visitTasks, loadingVisitTasksData: false });
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegate.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegate.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegate.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegate.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegate.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegate.id!);

        this.setState({
            selectedDelegate: delegate,
            delegatePlanDeTournee: planDeTournee,
            delegateCouverturePortfeuille: couverturePortfeuille,
            delegateMoyenneVisitesParJour: moyenneVisitesParJour,
            delegateObjectifChiffreDaffaire: objectifChiffreDaffaire,
            delegateObjectifVisites: objectifVisites,
            delegateSuccessRate: successRate,
        });
    }

    handleSelectKam = async (kam: UserModel) => {
        this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], });
        var visitTasks = await this.visitTaskService.getAllVisitsTasks(this.state.selectedDate, kam.id!);
        this.setState({ selectedKam: kam, kamVisitTasks: visitTasks, loadingVisitTasksData: false });
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, kam.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, kam.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, kam.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, kam.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, kam.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, kam.id!);

        this.setState({
            selectedDelegate: kam,
            kamPlanDeTournee: planDeTournee,
            kamCouverturePortfeuille: couverturePortfeuille,
            kamMoyenneVisitesParJour: moyenneVisitesParJour,
            kamObjectifChiffreDaffaire: objectifChiffreDaffaire,
            kamObjectifVisites: objectifVisites,
            kamSuccessRate: successRate,
        });
    }

    handleOnPickDate = async (date: Date) => {
        if (this.state.selectedDelegate) {
            this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], });
            var visitTasks = await this.visitTaskService.getAllVisitsTasks(date, this.state.selectedDelegate!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedDelegate!.id!);
            this.setState({ selectedDate: date, delegateVisitTasks: visitTasks, loadingVisitTasksData: false, });
            this.setState({
                selectedDate: date,
                delegatePlanDeTournee: planDeTournee,
                delegateCouverturePortfeuille: couverturePortfeuille,
                delegateMoyenneVisitesParJour: moyenneVisitesParJour,
                delegateObjectifChiffreDaffaire: objectifChiffreDaffaire,
                delegateObjectifVisites: objectifVisites,
                delegateSuccessRate: successRate,
            });
        }
        if (this.state.selectedKam) {
            this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], });
            var visitTasks = await this.visitTaskService.getAllVisitsTasks(date, this.state.selectedKam!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedKam!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedKam!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedKam!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedKam!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedKam!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedKam!.id!);
            this.setState({ selectedDate: date, kamVisitTasks: visitTasks, loadingVisitTasksData: false, });
            this.setState({
                selectedDate: date,
                kamPlanDeTournee: planDeTournee,
                kamCouverturePortfeuille: couverturePortfeuille,
                kamMoyenneVisitesParJour: moyenneVisitesParJour,
                kamObjectifChiffreDaffaire: objectifChiffreDaffaire,
                kamObjectifVisites: objectifVisites,
                kamSuccessRate: successRate,
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
            var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);
            this.setState({
                isLoading: false,
                kams: kams,
                supervisors: supervisors,
            });
        }


    };

    handleSelectSupervisor = async (supervisor: UserModel) => {

        this.setState({
            delegates: [],
            selectedSupervisor: supervisor,
            delegateVisitTasks: [],
            loadingDelegates: true,
        });

        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);

        this.setState({
            delegatePlanDeTournee: 0,
            delegateCouverturePortfeuille: 0,
            delegateMoyenneVisitesParJour: 0,
            delegateObjectifChiffreDaffaire: 0,
            delegateObjectifVisites: 0,
            delegateSuccessRate: 0,
            delegateVisitTasks: [],
            loadingDelegates: false,
            delegates: delegates,
        });
    }

    handleSelectVisitTaskDate = async (date: Date,) => {
        this.setState({ loadingVisitTaskDetails: true, delegateReport: undefined });
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

    compareDates = (a: VisitModel, b: VisitModel) => a!.createdDate!.getTime() - b!.createdDate!.getTime();

    handleDelegateDisplayMap = async (date: Date) => {
        this.setState({ loadingMap: true });
        var tasks = await this.taskService.getAllTasksOfDelegate(date, this.state.selectedDelegate!.id!);
        var visits = await this.visitService.getAllVisitsOfDelegateDay(date, this.state.selectedDelegate!.id!);
       
        visits.sort(this.compareDates);

        let visitsCoordinates: { point: number[], name: string, time: string }[] = visits.map((v) => {
            return {
                point: (v.visitLocation ?? ',').split(',').map((s) => parseFloat(s)),
                name: v.client?.name ?? '',
                time: formatTime(v.createdDate!),
            };
        });

        let tasksCoordinates: { point: number[], name: string }[] = tasks.filter((t) => !visits.some(v => v.client?.id === t.client?.id)).map((t) => {
            return {
                point: (t.client?.location ?? ',').split(',').map((s) => parseFloat(s)),
                name: t.client?.name ?? ''
            };
        });
        var trackings = await this.userTrackingService.getUserTrackingByDate(date, this.state.selectedDelegate!.id!);

        this.setState({
            loadingMap: false,
            showMap: true,
            trackings:trackings,
            visitsCoordinates: visitsCoordinates,
            tasksCoordinates: tasksCoordinates,
        });
    };

 

    handleKamDisplayMap = async (date: Date) => {
        this.setState({ loadingMap: true });
        var tasks = await this.taskService.getAllTasksOfDelegate(date, this.state.selectedKam!.id!);
        var visits = await this.visitService.getAllVisitsOfDelegateDay(date, this.state.selectedKam!.id!);

        let visitsCoordinates: { point: number[], name: string, time: string }[] = visits.map((v) => {
            return {
                point: (v.visitLocation ?? ',').split(',').map((s) => parseFloat(s)),
                name: v.client?.name ?? '',
                time: formatTime(v.createdDate!),
            };
        });

        let tasksCoordinates: { point: number[], name: string }[] = tasks.filter((t) => !visits.some(v => v.client?.id === t.client?.id)).map((t) => {
            return {
                point: (t.client?.location ?? ',').split(',').map((s) => parseFloat(s)),
                name: t.client?.name ?? ''
            };
        });

        var trackings = await this.userTrackingService.getUserTrackingByDate(date, this.state.selectedDelegate!.id!);

        this.setState({
            loadingMap: false,
            trackings:trackings,
            showMap: true,
            visitsCoordinates: visitsCoordinates,
            tasksCoordinates: tasksCoordinates,
        });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadPlanPageData();
        }
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
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                              
                                <Tab label="Superviseurs" />
                                {
                                    this.state.currentUser.type === UserType.admin ? (<Tab label="Kams" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={this.state.index} index={0} >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'stretch',
                                alignItems: 'stretch',
                                flexDirection: 'column',
                                flexGrow: '1',
                                height: 'calc(100vh  - 65px)',
                                width: '100%',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>
                                    {
                                        this.state.currentUser.type === UserType.admin ?
                                            (<div style={{
                                                height: '50px',
                                                width: '150px',
                                                marginLeft: '8px'
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
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                    <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div className='stats-panel' style={{ margin: '0px 8px 8px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                                    <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='KPI: Realisation plan de tournee' value={this.state.delegatePlanDeTournee} />
                                    <CircularProgressLabel colorStroke='#CC38E0' direction='row' secondTitle='Couverture portefeuille client' value={this.state.delegateCouverturePortfeuille} />
                                    <CircularProgressLabel colorStroke='#38EB5D' direction='row' secondTitle="Objectif chiffre d'affaire" value={this.state.delegateObjectifChiffreDaffaire} />
                                    <CircularProgressLabel colorStroke='#2FBCEB' direction='row' secondTitle='Objectif visites' value={this.state.delegateObjectifVisites * 100} />
                                    <CircularProgressLabel colorStroke='#FC4630' direction='row' secondTitle='Moyen visite/jour' formatter={(val) => val.toFixed(0)} value={this.state.delegateMoyenneVisitesParJour} />
                                    <CircularProgressLabel colorStroke='#3A25E6' direction='row' secondTitle='Taux de réussite' value={this.state.delegateSuccessRate} />
                                </div>
                                <div style={{
                                    width: '100%',
                                    flexGrow: '1',
                                    display: 'flex',
                                    height: 'calc(100% - 220px)',

                                }}>
                                    <PlanTable
                                        onDisplayDetails={this.handleSelectVisitTaskDate}
                                        onDisplayMap={this.handleDelegateDisplayMap}
                                        isLoading={this.state.loadingVisitTasksData}
                                        id='plantable'
                                        data={this.state.delegateVisitTasks}
                                    ></PlanTable>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 8px 8px',
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
                                                    marginTop: '8px',
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
                                <MapDialog
                                    visitsCoordinates={this.state.visitsCoordinates}
                                    tasksCoordinates={this.state.tasksCoordinates}
                                    trackings={this.state.trackings}
                                    isOpen={this.state.showMap}
                                    onClose={() => {
                                        this.setState({ showMap: false });
                                    }} />
                               
                                <div style={{

                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: this.state.loadingMap ? 'flex' : 'none',

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <DotSpinner

                                        size={40}
                                        speed={0.9}
                                        color="black"
                                    />
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={this.state.index} index={1} >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'stretch',
                                alignItems: 'stretch',
                                flexDirection: 'column',
                                flexGrow: '1',
                                height: 'calc(100vh  - 65px)',
                                width: '100%',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>

                                    <div style={{ height: '50px', width: '150px', margin: '0px 8px' }}>
                                        <UserDropdown
                                            users={this.state.kams}
                                            selectedUser={this.state.selectedKam}
                                            onSelectUser={this.handleSelectKam}
                                            label='Kam'
                                        />
                                    </div>
                                    <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div className='stats-panel' style={{ margin: '0px 8px 8px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                                    <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='KPI: Realisation plan de tournee' value={this.state.kamPlanDeTournee} />
                                    <CircularProgressLabel colorStroke='#CC38E0' direction='row' secondTitle='Couverture portefeuille client' value={this.state.kamCouverturePortfeuille} />
                                    <CircularProgressLabel colorStroke='#38EB5D' direction='row' secondTitle="Objectif chiffre d'affaire" value={this.state.kamObjectifChiffreDaffaire} />
                                    <CircularProgressLabel colorStroke='#2FBCEB' direction='row' secondTitle='Objectif visites' value={this.state.kamObjectifVisites * 100} />
                                    <CircularProgressLabel colorStroke='#FC4630' direction='row' secondTitle='Moyen visite/jour' formatter={(val) => val.toFixed(0)} value={this.state.kamMoyenneVisitesParJour} />
                                    <CircularProgressLabel colorStroke='#3A25E6' direction='row' secondTitle='Taux de réussite' value={this.state.kamSuccessRate} />
                                </div>
                                <div style={{
                                    width: '100%',
                                    flexGrow: '1',
                                    display: 'flex',
                                    height: 'calc(100% - 220px)',
                                }}>
                                    <PlanTable
                                        onDisplayDetails={this.handleSelectVisitTaskDate}
                                        onDisplayMap={this.handleKamDisplayMap}
                                        isLoading={this.state.loadingVisitTasksData}
                                        id='plantable'
                                        data={this.state.kamVisitTasks}
                                    ></PlanTable>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 8px 8px',
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
                                                    marginTop: '8px',
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
                                <MapDialog
                                    visitsCoordinates={this.state.visitsCoordinates}
                                    tasksCoordinates={this.state.tasksCoordinates}
                                    trackings={this.state.trackings}
                                    isOpen={this.state.showMap}
                                    onClose={() => {
                                        this.setState({ showMap: false });
                                    }} />
                                <div style={{

                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: this.state.loadingMap ? 'flex' : 'none',

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <DotSpinner

                                        size={40}
                                        speed={0.9}
                                        color="black"
                                    />
                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>


                </div>
            );
        }
    }
}

export default PlanPage;
