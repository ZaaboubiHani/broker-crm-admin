import React, { Component } from 'react';
import '../report-page/report-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import ReportTable from '../../components/report-table/report-table.component';
import DotSpinner from '@uiball/loaders/dist/components/DotSpinner';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserModel from '../../models/user.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../services/user.service';
import VisitModel from '../../models/visit.model';
import ReportPanel from '../../components/report-panel/report-panel.component';
import ReportModel from '../../models/report.model';
import VisitService from '../../services/visit.service';
import ReportService from '../../services/report.service';

interface ReportPageProps {
    selectedDate: Date;
    isLoading: boolean;
    hasData: boolean;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    searchText: string;
    selectedVisit?: VisitModel;
    reportData?: ReportModel;
    visits: VisitModel[];
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
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
            visits: [],
            searchText: '',
            delegates: [],
            filtredDelegates: [],
            totalDelegate: 0,
            sizeDelegate: 25,
            delegatePage: 1,
        }
    }

    userService = new UserService();
    visitService = new VisitService();
    reportService = new ReportService();

    handleDelegateFilter = () => {
        if (this.state.searchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates, selectedVisit: undefined, });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingVisitsData: true, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, visits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(this.state.delegatePage, this.state.sizeDelegate, date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDate: date, visits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    loadRepportPageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var delegates = await this.userService.getDelegateUsers();
            if (delegates.length > 0) {
                this.setState({ selectedDelegate: delegates[0] });
                var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, 25, new Date(), delegates[0].id!);
                this.setState({ visits: visits, totalDelegate: total });
            }
            this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
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
        this.setState({ visits: visits, loadingVisitsData: false, totalDelegate: total });
    }

    handleDelegateRowNumChange = async (size: number) => {
        this.setState({ loadingVisitsData: true, delegatePage: 1, sizeDelegate: size, reportData: undefined, selectedVisit: undefined, });
        var { visits: visits, total: total } = await this.visitService.getAllVisitsOfDelegate(1, size, this.state.selectedDate, this.state.selectedDelegate!.id!);
        this.setState({ visits: visits, loadingVisitsData: false, totalDelegate: total });
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
                <div className='report-container'>
                    <div className='search-bar'>
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
                    <div style={{ display: 'flex' }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                    </div>
                    <div className='table-panel' key={0}>
                        <ReportTable
                            total={this.state.totalDelegate}
                            page={this.state.delegatePage}
                            size={this.state.sizeDelegate}
                            pageChange={this.handleDelegatePageChange}
                            rowNumChange={this.handleDelegateRowNumChange}
                            isLoading={this.state.loadingVisitsData}
                            id='reporttable'
                            displayReport={this.handleDisplayReport}
                            data={this.state.visits}
                            selectedId={this.state.selectedVisit?.id ?? -1}
                        ></ReportTable>
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
                                    (
                                        <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.reportData} ></ReportPanel>
                                    )
                            }
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ReportPage;
