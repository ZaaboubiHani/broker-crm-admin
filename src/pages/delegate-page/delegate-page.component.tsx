import React, { Component } from 'react';
import '../delegate-page/delegate-page.style.css';
import DelegateTable from '../../components/delegate-table/delegate-table.component';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import UserModel, { UserType } from '../../models/user.model';
import { DotSpinner, DotWave } from '@uiball/loaders';
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
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CompoundBox, { RenderDirection } from '../../components/compound-box/compound-box.component';


interface DelegatePageState {
    selectedDate: Date;
    delegateVisits: VisitModel[];
    kamVisits: VisitModel[];
    delegates: UserModel[];
    selectedDelegate?: UserModel;
    kams: UserModel[];
    selectedKam?: UserModel;
    selectedReport?: ReportModel;
    selectedCommand?: CommandModel;
    selectedVisit?: VisitModel;
    isLoading: boolean;
    loadingDelegates: boolean;
    loadingReportData: boolean;
    loadingVisitsData: boolean;
    searchText: string;
    showReportPanel: boolean;
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
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
    totalKam: number;
    sizeKam: number;
    kamPage: number;
    index: number;
}

class DelegatePage extends Component<{}, DelegatePageState> {
    constructor() {
        super({});
        this.state = {
            selectedDate: new Date(),
            currentUser: new UserModel(),
            supervisors: [],
            delegateVisits: [],
            kamVisits: [],
            delegates: [],
            kams: [],
            isLoading: true,
            loadingDelegates: false,
            showReportPanel: true,
            loadingReportData: false,
            loadingVisitsData: false,
            searchText: '',
            delegatePlanDeTournee: 0,
            delegateCouverturePortfeuille: 0,
            delegateMoyenneVisitesParJour: 0,
            delegateObjectifChiffreDaffaire: 0,
            delegateObjectifVisites: 0,
            delegateSuccessRate: 0,
            kamPlanDeTournee: 0,
            kamCouverturePortfeuille: 0,
            kamMoyenneVisitesParJour: 0,
            kamObjectifChiffreDaffaire: 0,
            kamObjectifVisites: 0,
            kamSuccessRate: 0,
            totalDelegate: 0,
            sizeDelegate: 100,
            delegatePage: 1,
            totalKam: 0,
            sizeKam: 100,
            kamPage: 1,
            index: 0,
        }
    }

    userService = UserService.getInstance();
    visitService = VisitService.getInstance();
    reportService = ReportService.getInstance();
    commandService = CommandService.getInstance();
    statisticsService = StatisticsService.getInstance();

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
            var { visits: delegateVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, date, this.state.selectedDelegate!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedDelegate!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedDelegate!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedDelegate!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedDelegate!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedDelegate!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedDelegate!.id!);
            this.setState({
                selectedDate: date,
                delegateVisits: delegateVisits,
                delegatePlanDeTournee: planDeTournee,
                delegateCouverturePortfeuille: couverturePortfeuille,
                delegateMoyenneVisitesParJour: moyenneVisitesParJour,
                delegateObjectifChiffreDaffaire: objectifChiffreDaffaire,
                delegateObjectifVisites: objectifVisites,
                delegateSuccessRate: successRate,
                loadingVisitsData: false,
                delegatePage: 1,
                totalDelegate: total,
            });
        }
        if (this.state.selectedKam) {
            this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
            var { visits: kamVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, date, this.state.selectedKam!.id!);
            var planDeTournee = await this.statisticsService.getPlanDeTournee(date, this.state.selectedKam!.id!);
            var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(date, this.state.selectedKam!.id!);
            var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(date, this.state.selectedKam!.id!);
            var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(date, this.state.selectedKam!.id!);
            var objectifVisites = await this.statisticsService.getObjectifVisites(date, this.state.selectedKam!.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateMonth(date, this.state.selectedKam!.id!);
            this.setState({
                selectedDate: date,
                kamVisits: kamVisits,
                kamPlanDeTournee: planDeTournee,
                kamCouverturePortfeuille: couverturePortfeuille,
                kamMoyenneVisitesParJour: moyenneVisitesParJour,
                kamObjectifChiffreDaffaire: objectifChiffreDaffaire,
                kamObjectifVisites: objectifVisites,
                kamSuccessRate: successRate,
                loadingVisitsData: false,
                delegatePage: 1,
                totalDelegate: total,
            });
        }
    }

    handleSelectDelegate = async (delegate?: UserModel) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var { visits: delegateVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, this.state.sizeDelegate, this.state.selectedDate, delegate!.id!);
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, delegate!.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, delegate!.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, delegate!.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, delegate!.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, delegate!.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, delegate!.id!);

        this.setState({
            selectedDelegate: delegate,
            delegateVisits: delegateVisits,
            loadingVisitsData: false,
            delegatePlanDeTournee: planDeTournee,
            delegateCouverturePortfeuille: couverturePortfeuille,
            delegateMoyenneVisitesParJour: moyenneVisitesParJour,
            delegateObjectifChiffreDaffaire: objectifChiffreDaffaire,
            delegateObjectifVisites: objectifVisites,
            delegateSuccessRate: successRate,
            delegatePage: 1,
            totalDelegate: total,
        });
    }

    handleSelectKam = async (kam?: UserModel) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
        var { visits: kamVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, this.state.sizeDelegate, this.state.selectedDate, kam!.id!);
        var planDeTournee = await this.statisticsService.getPlanDeTournee(this.state.selectedDate, kam!.id!);
        var couverturePortfeuille = await this.statisticsService.getCouverturePortfeuille(this.state.selectedDate, kam!.id!);
        var moyenneVisitesParJour = await this.statisticsService.getMoyenneVisitesParJour(this.state.selectedDate, kam!.id!);
        var objectifChiffreDaffaire = await this.statisticsService.getObjectifChiffreDaffaire(this.state.selectedDate, kam!.id!);
        var objectifVisites = await this.statisticsService.getObjectifVisites(this.state.selectedDate, kam!.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateMonth(this.state.selectedDate, kam!.id!);

        this.setState({
            selectedKam: kam,
            kamVisits: kamVisits,
            loadingVisitsData: false,
            kamPlanDeTournee: planDeTournee,
            kamCouverturePortfeuille: couverturePortfeuille,
            kamMoyenneVisitesParJour: moyenneVisitesParJour,
            kamObjectifChiffreDaffaire: objectifChiffreDaffaire,
            kamObjectifVisites: objectifVisites,
            kamSuccessRate: successRate,
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
            var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);

            this.setState({
                isLoading: false,
                supervisors: supervisors,
                kams: kams
            });
        }


    };



    handleSelectSupervisor = async (supervisor?: UserModel) => {
        this.setState({
            selectedReport: undefined,
            selectedCommand: undefined,
            selectedVisit: undefined,
            delegates: [],
            delegateVisits: [],
            loadingDelegates: true,
        });

        var delegates = await this.userService.getUsersByCreator(supervisor!.id!, UserType.delegate);


        this.setState({ delegates: delegates, loadingDelegates: false, });
    }

    handleDelegatePageChange = async (page: number, size: number) => {
        if (this.state.selectedDelegate) {
            this.setState({ loadingVisitsData: true, delegatePage: page, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
            var { visits: delegateVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(page, size, this.state.selectedDate, this.state.selectedDelegate!.id!);
            this.setState({ delegateVisits: delegateVisits, loadingVisitsData: false, totalDelegate: total, sizeDelegate: size });
        }
    }

    handleKamPageChange = async (page: number, size: number) => {
        if (this.state.selectedKam) {
            this.setState({ loadingVisitsData: true, kamPage: page, selectedReport: undefined, selectedCommand: undefined, selectedVisit: undefined });
            var { visits: kamVisits, total: total } = await this.visitService.getAllVisitsOfDelegate(page, size, this.state.selectedDate, this.state.selectedKam!.id!);
            this.setState({ kamVisits: kamVisits, loadingVisitsData: false, totalKam: total, sizeKam: size });
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadDelegatePageData();
        }
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
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Superviseurs" />
                                {
                                    this.state.currentUser.type !== UserType.supervisor ? (<Tab label="Kams" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
                                    {
                                        this.state.currentUser.type !== UserType.supervisor ?
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
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                    <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div className='stats-panel' style={{ margin: '0px 8px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                                    <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='Realisation plan de tournee' value={this.state.delegatePlanDeTournee} />
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
                                    height: 'calc(100% - 220px)'
                                }}>
                                    <CompoundBox
                                        direction={RenderDirection.horizontal}
                                        flexes={[70, 30]}
                                        >
                                        <DelegateTable
                                            id='delegatetable'
                                            total={this.state.totalDelegate}
                                            page={this.state.delegatePage}
                                            size={this.state.sizeDelegate}
                                            pageChange={this.handleDelegatePageChange}
                                            isLoading={this.state.loadingVisitsData}
                                            data={this.state.delegateVisits}
                                            onDisplayCommand={this.handleDisplayCommand}
                                            onDisplayReport={this.handleDisplayReport}
                                        ></DelegateTable>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
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
                                    </CompoundBox>

                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px', }}>
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
                                <div className='stats-panel' style={{ margin: '0px 8px 8px', paddingLeft: '16px', backgroundColor: 'white' }}>
                                    <CircularProgressLabel colorStroke='#FC761E' direction='row' secondTitle='Realisation plan de tournee' value={this.state.kamPlanDeTournee} />
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
                                    height: 'calc(100% - 220px)'
                                }}>
                                    <CompoundBox
                                        direction={RenderDirection.horizontal}
                                        flexes={[70, 30]}
                                        >
                                        <DelegateTable
                                            id='delegatetable'
                                            total={this.state.totalKam}
                                            page={this.state.kamPage}
                                            size={this.state.sizeKam}
                                            pageChange={this.handleKamPageChange}
                                            isLoading={this.state.loadingVisitsData}
                                            data={this.state.kamVisits}
                                            onDisplayCommand={this.handleDisplayCommand}
                                            onDisplayReport={this.handleDisplayReport}
                                        ></DelegateTable>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
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
                                    </CompoundBox>
                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            );
        }
    }
}


export default DelegatePage;
