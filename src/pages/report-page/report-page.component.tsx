import React, { Component } from 'react';
import '../report-page/report-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import ReportTable from '../../components/report-table/report-table.component';
import DotSpinner from '@uiball/loaders/dist/components/DotSpinner';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserModel, { UserType } from '../../models/user.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../services/user.service';
import VisitModel from '../../models/visit.model';
import ReportPanel from '../../components/report-panel/report-panel.component';
import ReportModel from '../../models/report.model';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface ReportPageProps {
    selectedDate: Date;
    isLoading: boolean;
    hasData: boolean;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    delegateSearchText: string;
    kamSearchText: string;
    selectedVisit?: VisitModel;
    reportData?: ReportModel;
    delegateVisits: VisitModel[];
    kamVisits: VisitModel[];
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    supervisors: UserModel[];
    kams: UserModel[];
    filtredKams: UserModel[];
    selectedDelegate?: UserModel;
    selectedSupervisor?: UserModel;
    selectedKam?: UserModel;
    currentUser: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
    totalKam: number;
    sizeKam: number;
    kamPage: number;
    index: number;
}

class ReportPage extends Component<{}, ReportPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            isLoading: false,
            hasData: false,
            loadingVisitsData: false,
            loadingReportData: false,
            delegateVisits: [],
            kamVisits: [],
            delegateSearchText: '',
            kamSearchText: '',
            delegates: [],
            supervisors: [],
            kams: [],
            filtredDelegates: [],
            filtredKams: [],
            totalDelegate: 0,
            sizeDelegate: 25,
            delegatePage: 1,
            totalKam: 0,
            sizeKam: 25,
            kamPage: 1,
            index: 0,
            currentUser: new UserModel(),
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();

    handleDelegateFilter = () => {
        if (this.state.delegateSearchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.delegateSearchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
    }

    handleKamFilter = () => {
        if (this.state.kamSearchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.kamSearchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitsData: true, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, delegateVisits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    handleSelectKam = async (kam: UserModel) => {
        this.setState({ loadingVisitsData: true, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.kamPage, this.state.sizeKam, this.state.selectedDate, kam.id!);
        this.setState({ selectedKam: kam, kamVisits: visits, loadingVisitsData: false, totalKam: total });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, reportData: undefined, selectedVisit: undefined, });
        var { visits: delegateVisits, total: delegateTotal } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, date, this.state.selectedDelegate!.id!);
        var { visits: kamVisits, total: kamTotal } = await this.visitService.getAllVisitsOfDelegate(this.state.kamPage, this.state.sizeKam, date, this.state.selectedKam!.id!);
        this.setState({
            selectedDate: date,
            delegateVisits: delegateVisits,
            kamVisits: kamVisits,
            loadingVisitsData: false,
            totalDelegate: delegateTotal,
            totalKam: kamTotal,
        });
    }

    loadRepportPageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var currentUser = await this.userService.getMe();
            if (currentUser != undefined) {
                this.setState({ currentUser: currentUser });
            }

            if (currentUser.type === UserType.supervisor) {
                var delegates = await this.userService.getDelegateUsers();
                if (delegates.length > 0) {
                    this.setState({ selectedDelegate: delegates[0] });
                    var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, 25, new Date(), delegates[0].id!);
                    this.setState({ delegateVisits: visits, totalDelegate: total });
                }
                this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
            }
            else {
                var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
                var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);
                if (supervisors.length > 0) {
                    var delegates = await this.userService.getUsersByCreator(supervisors[0].id!, UserType.delegate);
                    if (delegates.length > 0) {
                        this.setState({ selectedDelegate: delegates[0] });
                        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, 25, new Date(), delegates[0].id!);
                        this.setState({ delegateVisits: visits, totalDelegate: total, selectedDelegate: delegates[0] });
                    }
                    this.setState({
                        isLoading: false,
                        delegates: delegates,
                        filtredDelegates: delegates,
                        hasData: true,
                        selectedSupervisor: supervisors[0]
                    });

                }
                if (kams.length > 0) {
                    var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, 25, new Date(), kams[0].id!);
                    this.setState({ kamVisits: visits, totalKam: total, selectedKam: kams[0] });
                }
                this.setState({
                    supervisors: supervisors,
                    kams: kams,
                    filtredKams: kams
                });
            }

            this.setState({
                currentUser: currentUser,
                isLoading: false,
                hasData: true,
            });
        }
    }


    handleDisplayReport = async (visit: VisitModel) => {
        this.setState({ loadingReportData: true, reportData: undefined, selectedVisit: undefined, });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({ loadingReportData: false, reportData: report, selectedVisit: visit, });
    };

    handleDelegatePageChange = async (page: number) => {
        this.setState({ loadingVisitsData: true, delegatePage: page, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(page, this.state.sizeDelegate, this.state.selectedDate, this.state.selectedDelegate!.id!);
        this.setState({ delegateVisits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    handleKamPageChange = async (page: number) => {
        this.setState({ loadingVisitsData: true, kamPage: page, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(page, this.state.sizeKam, this.state.selectedDate, this.state.selectedKam!.id!);
        this.setState({ kamVisits: visits, loadingVisitsData: false, totalKam: total });
    }

    handleDelegateRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, delegatePage: 1, sizeDelegate: size, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, size, this.state.selectedDate, this.state.selectedDelegate!.id!);
        this.setState({ delegateVisits: visits, loadingVisitsData: false, totalDelegate: total });
    }
    handleKamRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, kamPage: 1, sizeDelegate: size, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, size, this.state.selectedDate, this.state.selectedKam!.id!);
        this.setState({ kamVisits: visits, loadingVisitsData: false, totalKam: total });
    }

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingVisitsData: true, delegatePage: 1, delegates: [], filtredDelegates: [], totalDelegate: 0 });
        var delegates = await this.userService.getUsersByCreator(supervisor!.id!, UserType.delegate);
        if (delegates.length > 0) {
            this.setState({ selectedDelegate: delegates[0] });
            var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, 25, new Date(), delegates[0].id!);
            this.setState({ delegateVisits: visits, totalDelegate: total });
        }
        this.setState({
            selectedSupervisor: supervisor,
            delegates: delegates,
            filtredDelegates: delegates,
        });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, selectedVisit: undefined, reportData: undefined });
    };

    handleDelegateSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ delegateSearchText: event.target.value });
    }

    handleKamSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ delegateSearchText: event.target.value });
    }


    render() {
        if (!this.state.hasData) {
            this.loadRepportPageData();
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '50px' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Délégués" />
                                {
                                    this.state.currentUser.type === UserType.admin ? (<Tab label="Kam" />) : null
                                }

                            </Tabs>
                        </Box>
                    </Box>
                    <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 55px)', padding: '0px' }} value={this.state.index} index={0} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 45px)' }}>
                            <div className='report-container'>
                                {
                                    this.state.currentUser.type === UserType.admin ? (<div style={{ display: 'flex', height: '55px' }}>
                                        <UserPicker delegates={this.state.supervisors} onSelect={this.handleSelectSupervisor}></UserPicker>
                                    </div>) : null
                                }
                                <div className='search-bar'>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleDelegateSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>
                                    <MonthYearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                                </div>
                                <div className='table-panel' >
                                    <ReportTable
                                        total={this.state.totalDelegate}
                                        page={this.state.delegatePage}
                                        size={this.state.sizeDelegate}
                                        pageChange={this.handleDelegatePageChange}
                                        rowNumChange={this.handleDelegateRowNumChange}
                                        isLoading={this.state.loadingVisitsData}
                                        id='reporttable'
                                        displayReport={this.handleDisplayReport}
                                        data={this.state.delegateVisits}
                                        selectedId={this.state.selectedVisit?.id ?? -1}
                                    ></ReportTable>
                                    <div style={{ backgroundColor: 'white', width: '50%'}}>
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
                                                (
                                                    <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.reportData} ></ReportPanel>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 55px)' }} value={this.state.index} index={1} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 45px)' }}>

                            <div className='report-container'>

                                <div className='search-bar'>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleKamSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleKamFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>
                                    <MonthYearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <UserPicker delegates={this.state.filtredKams} onSelect={this.handleSelectKam}></UserPicker>
                                </div>
                                <div className='table-panel' key={0}>
                                    <ReportTable
                                        total={this.state.totalKam}
                                        page={this.state.kamPage}
                                        size={this.state.sizeKam}
                                        pageChange={this.handleKamPageChange}
                                        rowNumChange={this.handleKamRowNumChange}
                                        isLoading={this.state.loadingVisitsData}
                                        id='reporttable'
                                        displayReport={this.handleDisplayReport}
                                        data={this.state.kamVisits}
                                        selectedId={this.state.selectedVisit?.id ?? -1}
                                    ></ReportTable>
                                    <div style={{ backgroundColor: 'white', width: '50%', }}>
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
                                                (
                                                    <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.reportData} ></ReportPanel>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CustomTabPanel>

                </div>

            );
        }
    }
}

export default ReportPage;
