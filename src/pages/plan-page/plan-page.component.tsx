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
import VisitTaskModel from '../../models/visit-task.model';
import UserService from '../../services/user.service';
import { DotSpinner } from '@uiball/loaders';
import StatisticsService from '../../services/statics.service';
import PlanPanel from '../../components/plan-panel/plan-panel.component';
import VisitTaskService from '../../services/visit-task.service';
import TaskService from '../../services/task.service';
import VisitService from '../../services/visit.service';
import TaskModel from '../../models/task.model';
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';

interface PlanPageProps {
    selectedDate: Date;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    loadingVisitTasksData: boolean;
    hasData: boolean;
    isLoading: boolean;
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
            filtredDelegates: [],
            loadingVisitTasksData: false,
            isLoading: false,
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
            hasData: false,
        }
    }

    userService = new UserService();
    statisticsService = new StatisticsService();
    visitTaskService = new VisitTaskService();
    taskService = new TaskService();
    visitService = new VisitService();

    handleDelegateFilter = () => {
        if (this.state.searchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates, selectedIndex: -1 });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates, selectedIndex: -1 });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
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
        this.setState({ loadingVisitTasksData: true, selectedVisitTaskDate: undefined, visitTaskDetails: [], selectedIndex: -1 });
        var visitTasks = await this.visitTaskService.getAllVisitsTasks(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDate: date, visitTasks: visitTasks, loadingVisitTasksData: false, });
        var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedDelegate!.id!);
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

    loadPlanPageData = async () => {
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
                    var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegates[0].id!);
                    var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegates[0].id!);
                    var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegates[0].id!);
                    var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegates[0].id!);
                    var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegates[0].id!);
                    var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegates[0].id!);
                    var visitTasks = await this.visitTaskService.getAllVisitsTasks(new Date(), delegates[0].id!);
                    this.setState({
                        visitTasks: visitTasks,
                        planDeTournee: planDeTournee,
                        couverturePortfeuille: couverturePortfeuille,
                        moyenneVisitesParJour: moyenneVisitesParJour,
                        objectifChiffreDaffaire: objectifChiffreDaffaire,
                        objectifVisites: objectifVisites,
                        successRate: successRate,
                    });
                }
                this.setState({ isLoading: false, hasData: true, delegates: delegates, filtredDelegates: delegates });
            }
            else {
                var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);

                if (supervisors.length > 0) {
                    var delegates = await this.userService.getUsersByCreator(supervisors[0].id!, UserType.delegate);
                    if (delegates.length > 0) {
                        this.setState({ selectedDelegate: delegates[0] });
                        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegates[0].id!);
                        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegates[0].id!);
                        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegates[0].id!);
                        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegates[0].id!);
                        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegates[0].id!);
                        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegates[0].id!);
                        var visitTasks = await this.visitTaskService.getAllVisitsTasks(new Date(), delegates[0].id!);
                        this.setState({
                            visitTasks: visitTasks,
                            planDeTournee: planDeTournee,
                            couverturePortfeuille: couverturePortfeuille,
                            moyenneVisitesParJour: moyenneVisitesParJour,
                            objectifChiffreDaffaire: objectifChiffreDaffaire,
                            objectifVisites: objectifVisites,
                            successRate: successRate,
                        });
                    }
                    this.setState({
                        isLoading: false,
                        hasData: true,
                        delegates: delegates,
                        filtredDelegates: delegates,
                        supervisors: supervisors,
                        selectedSupervisor: supervisors[0],
                    });
                }
            }

        }
    };

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingVisitTaskDetails: true, delegates: [],selectedSupervisor:supervisor });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        if (delegates.length > 0) {
            this.setState({ selectedDelegate: delegates[0] });
            var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegates[0].id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegates[0].id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegates[0].id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegates[0].id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegates[0].id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegates[0].id!);
            var visitTasks = await this.visitTaskService.getAllVisitsTasks(new Date(), delegates[0].id!);
            this.setState({
                visitTasks: visitTasks,
                planDeTournee: planDeTournee,
                couverturePortfeuille: couverturePortfeuille,
                moyenneVisitesParJour: moyenneVisitesParJour,
                objectifChiffreDaffaire: objectifChiffreDaffaire,
                objectifVisites: objectifVisites,
                successRate: successRate,
            });
        }
        this.setState({ loadingVisitTaskDetails: false, delegates: delegates, filtredDelegates: delegates });
    }

    handleSelectVisitTaskDate = async (date: Date, index: number) => {
        this.setState({ loadingVisitTaskDetails: true, selectedIndex: index });
        var tasks = await this.taskService.getAllTasksOfDelegate(date, this.state.selectedDelegate!.id!);
        var visits = await this.visitService.getAllVisitsOfDelegateDay(date, this.state.selectedDelegate!.id!);
        tasks.forEach((task) => {
            if (visits.some(v => v.client?.id === task.client?.id)) {
                task.isDone = true;
            }
        });
        this.setState({ visitTaskDetails: tasks, loadingVisitTaskDetails: false });
    };


    render() {
        if (!this.state.hasData) {
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
                    {
                        this.state.currentUser.type === UserType.admin ? (<div style={{ display: 'flex',height:'50px' }}>
                            <UserPicker delegates={this.state.supervisors} onSelect={this.handleSelectSupervisor}></UserPicker>
                        </div>) : null
                    }
                    <div className='search-bar' >
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
                    <div style={{ display: 'flex', }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                    </div>
                    <div className='stats-panel' style={{ margin: '0px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                        <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='KPI: Realisation plan de tournee' value={this.state.planDeTournee} />
                        <CircularProgressLabel colorStroke='#CC38E0' direction='row' secondTitle='Couverture portefeuille client' value={this.state.couverturePortfeuille} />
                        <CircularProgressLabel colorStroke='#38EB5D' direction='row' secondTitle="Objectif chiffre d'affaire" value={this.state.objectifChiffreDaffaire} />
                        <CircularProgressLabel colorStroke='#2FBCEB' direction='row' secondTitle='Objectif visites' value={this.state.objectifVisites * 100} />
                        <CircularProgressLabel colorStroke='#FC4630' direction='row' secondTitle='Moyen visite/jour' formatter={(val) => val.toFixed(0)} value={this.state.moyenneVisitesParJour} />
                        <CircularProgressLabel colorStroke='#3A25E6' direction='row' secondTitle='Taux de réussite' value={this.state.successRate} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1', height: 'calc(100% - 500px)' }}>
                        <PlanTable selectedId={this.state.selectedIndex} onDisplayDetails={this.handleSelectVisitTaskDate} isLoading={this.state.loadingVisitTasksData} id='plantable' data={this.state.visitTasks}></PlanTable>
                        <div className='user-panel'>
                            <PlanPanel isLoading={this.state.loadingVisitTaskDetails} data={this.state.visitTaskDetails}></PlanPanel>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default PlanPage;
