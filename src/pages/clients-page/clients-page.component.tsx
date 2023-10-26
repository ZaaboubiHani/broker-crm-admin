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

interface ClientsPageProps {
    selectedDate: Date;
    hasData: boolean;
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
}


class ClientsPage extends Component<{}, ClientsPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            hasData: false,
            isLoading: false,
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
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var currentUser = await this.userService.getMe();
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, 25, '', ClientType.pharmacy, currentUser.id!);
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, 25, '', ClientType.doctor, currentUser.id!);
            var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, 25, '', ClientType.wholesaler, currentUser.id!);
            this.setState({
                currentUser: currentUser,
                isLoading: false,
                hasData: true,
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
                docVisits: docVisits,
                totalDoc: totalDoc,
                wholeVisits: wholeVisits,
                totalWhole: totalWhole,
            });
        }
    };

    handlePharmVisitsFilter = async () => {
        this.setState({ pharmReportData: undefined, pharmCommandData: undefined, pharmPage: 1, loadingVisitsData: true });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, this.state.sizePharm, this.state.pharmSearchText, ClientType.pharmacy, this.state.currentUser.id!);
        this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, loadingVisitsData: false, pharmPage: 1, });
    }
    handleWholeVisitsFilter = async () => {
        this.setState({ wholeReportData: undefined, wholeCommandData: undefined, wholePage: 1, loadingVisitsData: true });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeWhole, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!);
        this.setState({ wholeVisits: wholeVisits, totalWhole: totalWhole, loadingVisitsData: false });
    }

    handleDocVisitsFilter = async () => {
        this.setState({ docReportData: undefined, docPage: 1, loadingVisitsData: true });
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeDoc, this.state.docSearchText, ClientType.doctor, this.state.currentUser.id!);
        this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false });
    }

    handlePharmSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pharmSearchText: event.target.value });
    }

    handleDocSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ docSearchText: event.target.value });
    }

    handleWholeSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ wholeSearchText: event.target.value });
    }

    handlePharmPageChange = async (page: number) => {
        this.setState({ loadingVisitsData: true, pharmPage: page });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(page, this.state.sizePharm, this.state.pharmSearchText, ClientType.pharmacy, this.state.currentUser.id!);
        this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, loadingVisitsData: false, });
    }
    handleWholePageChange = async (page: number) => {
        this.setState({ loadingVisitsData: true, wholePage: page });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(page, this.state.sizeWhole, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!);
        this.setState({ wholeVisits: wholeVisits, totalWhole: totalWhole, loadingVisitsData: false, });
    }

    handleDocPageChange = async (page: number) => {
        this.setState({ loadingVisitsData: true, docPage: page });
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(page, this.state.sizeDoc, this.state.docSearchText, ClientType.doctor, this.state.currentUser.id!);
        this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false, });
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

    render() {

        if (!this.state.hasData) {
            this.loadClientsPageData();
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
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', }} value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', }}>
                                <div style={{ display: 'flex', height: '40px', marginLeft: '8px', }}>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handlePharmSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handlePharmVisitsFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px', margin: '0px 0px 0px 8px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>

                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 40px)', }}>
                                    <ClientsPharmacyTable total={this.state.totalPharm} page={this.state.pharmPage} size={this.state.sizePharm} pageChange={this.handlePharmPageChange} rowNumChange={this.handlePharmRowNumChange} id='clients-pharmacy-table' data={this.state.pharmVisits} isLoading={this.state.loadingVisitsData} displayCommand={this.handleDisplayPharmCommand} displayReport={this.handleDisplayPharmReport}></ClientsPharmacyTable>
                                    <div style={{ backgroundColor: 'white', borderRadius: '8px', margin: '8px 0px', width: '40%' }}>
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
                                                    <ReportPanel report={this.state.pharmReportData} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <CommandPanel command={this.state.pharmCommandData} ></CommandPanel>
                                                    )
                                        }
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)' }} value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 48px)' }}>
                                <div style={{ display: 'flex', height: '40px', marginLeft: '8px', }}>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleDocSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleDocVisitsFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px', margin: '0px 0px 0px 8px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 48px)' }}>
                                    <ClientsDoctorTable total={this.state.totalDoc} page={this.state.docPage} size={this.state.sizeDoc} pageChange={this.handleDocPageChange} rowNumChange={this.handleDocRowNumChange} data={this.state.docVisits} isLoading={this.state.loadingVisitsData} displayReport={this.handleDisplayDocReport}></ClientsDoctorTable>
                                    <div style={{ backgroundColor: 'white', borderRadius: '8px', margin: '8px 0px', width: '40%' }}>
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
                                <div style={{ display: 'flex', height: '40px', marginLeft: '8px', }}>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleWholeSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleWholeVisitsFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px', margin: '0px 0px 0px 8px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>

                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 40px)' }}>
                                    <ClientsPharmacyTable total={this.state.totalWhole} page={this.state.wholePage} size={this.state.sizeWhole} pageChange={this.handleWholePageChange} rowNumChange={this.handleWholeRowNumChange} id='clients-pharmacy-table' data={this.state.wholeVisits} isLoading={this.state.loadingVisitsData} displayCommand={this.handleDisplayWholeCommand} displayReport={this.handleDisplayWholeReport}></ClientsPharmacyTable>
                                    <div style={{ backgroundColor: 'white', borderRadius: '8px', margin: '8px 0px', width: '40%' }}>
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
