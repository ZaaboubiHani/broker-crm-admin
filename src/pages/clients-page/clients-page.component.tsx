import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import { Component } from 'react';
import '../clients-page/clients-page.style.css';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../services/user.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CommandService from '../../services/command.service';
import CommandModel from '../../models/command.model';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import ReportModel from '../../models/report.model';
import ClientsPharmacyTable from '../../components/clients-pharmacy-table/clients-pharmacy-table.component';
import VisitModel from '../../models/visit.model';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';
import ReportPanel from '../../components/report-panel/report-panel.component';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ClientsDoctorTable from '../../components/clients-doctor-table/clients-doctor-table.component';
import { ClientType } from '../../models/client.model';
import UserModel, { UserType } from '../../models/user.model';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserDropdown from '../../components/user-dropdown/user-dropdown';

interface ClientsPageProps {
    selectedDate: Date;
    isLoading: boolean;
    pharmSearchText: string;
    docSearchText: string;
    wholeSearchText: string;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    showReportPanel: boolean;
    pharmVisits: VisitModel[];
    docVisits: VisitModel[];
    wholeVisits: VisitModel[];
    selectedVisit?: VisitModel;
    pharmReportData?: ReportModel;
    pharmCommandData?: CommandModel;
    wholeReportData?: ReportModel;
    wholeCommandData?: CommandModel;
    docReportData?: ReportModel;
    pharmPage: number;
    docPage: number;
    wholePage: number;
    sizePharm: number;
    sizeDoc: number;
    sizeWhole: number;
    totalPharm: number;
    totalDoc: number;
    totalWhole: number;
    index: number;
    currentUser: UserModel;
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
}


class ClientsPage extends Component<{}, ClientsPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            docSearchText: '',
            pharmSearchText: '',
            wholeSearchText: '',
            docVisits: [],
            pharmVisits: [],
            wholeVisits: [],
            loadingVisitsData: false,
            loadingReportData: false,
            showReportPanel: false,
            pharmPage: 1,
            docPage: 1,
            wholePage: 1,
            sizeDoc: 25,
            sizePharm: 25,
            sizeWhole: 25,
            totalPharm: 0,
            totalDoc: 0,
            totalWhole: 0,
            index: 0,
            supervisors: [],
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();
    commandService = new CommandService();

    handleDisplayPharmReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, pharmReportData: undefined, showReportPanel: true });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, pharmReportData: report, selectedVisit: visit, showReportPanel: true });

    };
    handleDisplayWholeReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, wholeReportData: undefined, showReportPanel: true });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, wholeReportData: report, selectedVisit: visit, showReportPanel: true });

    };

    handleDisplayDocReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, docReportData: undefined, showReportPanel: true });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, docReportData: report, selectedVisit: visit, showReportPanel: true });

    };

    handleDisplayPharmCommand = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, pharmCommandData: undefined, showReportPanel: false });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({ loadingReportData: false, pharmCommandData: command, selectedVisit: visit, showReportPanel: false });
    };
    handleDisplayWholeCommand = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, wholeCommandData: undefined, showReportPanel: false });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({ loadingReportData: false, wholeCommandData: command, selectedVisit: visit, showReportPanel: false });
    };

    loadClientsPageData = async () => {

        var currentUser = await this.userService.getMe();
        if (currentUser.type === UserType.supervisor) {
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, 25, this.state.pharmSearchText, ClientType.pharmacy, this.state.currentUser.id!);
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, 25, this.state.docSearchText, ClientType.doctor, this.state.currentUser.id!);

            this.setState({
                currentUser: currentUser,
                isLoading: false,
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
                docVisits: docVisits,
                totalDoc: totalDoc,
            });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, 25, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!);
            this.setState({
                wholeVisits: wholeVisits,
                totalWhole: totalWhole,
                supervisors: supervisors,
                currentUser: currentUser,
                isLoading: false,

            });
        }

    };

    handlePharmPageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, pharmPage: page, sizePharm: size });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(page, size, this.state.pharmSearchText, ClientType.pharmacy, this.state.currentUser.id!);
        this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, loadingVisitsData: false, sizePharm: size });
    }

    handleWholePageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, wholePage: page, sizeWhole: size });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(page, size, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!);
        this.setState({ wholeVisits: wholeVisits, totalWhole: totalWhole, loadingVisitsData: false, sizeWhole: size });
    }

    handleDocPageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, docPage: page, sizeDoc: size });
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(page, size, this.state.docSearchText, ClientType.doctor, this.state.currentUser.id!);
        this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false, sizeDoc: size });
    }

    handlePharmRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, pharmPage: 1, sizePharm: size });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, size, this.state.pharmSearchText, ClientType.pharmacy, this.state.currentUser.id!);
        this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, loadingVisitsData: false, });
    }
    handleWholeRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, wholePage: 1, sizeWhole: size });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, size, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!);
        this.setState({ wholeVisits: wholeVisits, totalWhole: totalWhole, loadingVisitsData: false, });
    }

    handleDocRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, docPage: 1, sizeDoc: size });
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, size, this.state.docSearchText, ClientType.doctor, this.state.currentUser.id!);
        this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false, });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, selectedSupervisor: supervisor });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, 25, '', ClientType.pharmacy, supervisor!.id!);
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, 25, '', ClientType.doctor, supervisor!.id!);
        this.setState({
            selectedSupervisor: supervisor,
            loadingVisitsData: false,
            pharmVisits: pharmVisits,
            totalPharm: totalPharm,
            docVisits: docVisits,
            totalDoc: totalDoc,
        });
    }

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadClientsPageData();
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
                <div className='clients-pharmacy-container' style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Pharmacies" />
                                <Tab label="Médecins" />
                                {
                                    this.state.currentUser.type === UserType.admin ? (<Tab label="Grossiste" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: `calc(100% - ${this.state.currentUser.type !== UserType.supervisor ? '105' : '50'}px)`, }} value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
                                    {
                                        this.state.currentUser.type === UserType.admin ? (<div style={{ height: '50px', width: '150px', marginRight: '8px' }}>
                                            <UserDropdown
                                                users={this.state.supervisors}
                                                selectedUser={this.state.selectedSupervisor}
                                                onSelectUser={this.handleSelectSupervisor}
                                                label='Superviseur'
                                            />
                                        </div>) : null
                                    }


                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 0px)', }}>
                                    <ClientsPharmacyTable
                                        total={this.state.totalPharm}
                                        page={this.state.pharmPage}
                                        size={this.state.sizePharm}
                                        pageChange={this.handlePharmPageChange}
                                        id='clients-pharmacy-table'
                                        data={this.state.pharmVisits}
                                        isLoading={this.state.loadingVisitsData}
                                        displayCommand={this.handleDisplayPharmCommand}
                                        displayReport={this.handleDisplayPharmReport}
                                    ></ClientsPharmacyTable>
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
                                                    height: '100%',
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
                                                    <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.pharmReportData} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <CommandPanel command={this.state.pharmCommandData} ></CommandPanel>
                                                    )
                                        }
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: `calc(100% - ${this.state.currentUser.type !== UserType.supervisor ? '105' : '50'}px)` }} value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 48px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
                                    {
                                        this.state.currentUser.type === UserType.admin ? (<div style={{ height: '50px', width: '150px', marginRight: '8px' }}>
                                            <UserDropdown
                                                users={this.state.supervisors}
                                                selectedUser={this.state.selectedSupervisor}
                                                onSelectUser={this.handleSelectSupervisor}
                                                label='Superviseur'
                                            />
                                        </div>) : null
                                    }
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 0px)' }}>

                                    <ClientsDoctorTable
                                        id='clients-doctor-table'
                                        total={this.state.totalDoc}
                                        page={this.state.docPage}
                                        size={this.state.sizeDoc}
                                        pageChange={this.handleDocPageChange}
                                        data={this.state.docVisits}
                                        isLoading={this.state.loadingVisitsData}
                                        displayReport={this.handleDisplayDocReport}
                                    ></ClientsDoctorTable>

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
                                                    height: '100%',
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
                                                    <ReportPanel report={this.state.docReportData} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)' }} value={this.state.index} index={2} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)' }}>

                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 0px)' }}>
                                    <ClientsPharmacyTable
                                        total={this.state.totalWhole}
                                        page={this.state.wholePage}
                                        size={this.state.sizeWhole}
                                        pageChange={this.handleWholePageChange}
                                        id='clients-pharmacy-table'
                                        data={this.state.wholeVisits}
                                        isLoading={this.state.loadingVisitsData}
                                        displayCommand={this.handleDisplayWholeCommand}
                                        displayReport={this.handleDisplayWholeReport}
                                    ></ClientsPharmacyTable>
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
                                                    height: '100%',
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
                                                    <ReportPanel report={this.state.wholeReportData} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <CommandPanel command={this.state.wholeCommandData} ></CommandPanel>
                                                    )
                                        }
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            );
        }
    }
}

export default ClientsPage;
