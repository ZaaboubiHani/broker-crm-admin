import React, { Component } from 'react';
import DatePickerBar from '../../components/date-picker/date-picker.component';
import '../home-page/home-page.style.css';
import HomeTable from '../../components/home-table/home-table.component';
import UserService from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders'
import VisitService from '../../services/visit.service';
import VisitModel from '../../models/visit.model';
import ReportModel from '../../models/report.model';
import ReportService from '../../services/report.service';
import ReportPanel from '../../components/report-panel/report-panel.component';
import CommandModel from '../../models/command.model';
import CommandService from '../../services/command.service';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import { ClientType } from '../../models/client.model';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface HomePageState {
    selectedDate: Date;
    selectedReport?: ReportModel;
    selectedCommand?: CommandModel;
    selectedVisit?: VisitModel;
    isLoading: boolean;
    loadingVisitsData: boolean;
    loadingReportData: boolean;
    showReportPanel: boolean;
    delegateVisits: VisitModel[];
    filteredDelegateVisits: VisitModel[];
    kamVisits: VisitModel[];
    filteredKamVisits: VisitModel[];
    delegateSearchText: string;
    kamSearchText: string;
    index: number;
    currentUser: UserModel;
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
    totalKam: number;
    sizeKam: number;
    kamPage: number;
    delegateOrder: boolean;
    kamOrder: boolean;
    kamProp?: string;
    delegateProp?: string;
}




class HomePage extends Component<{}, HomePageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            currentUser: new UserModel(),
            index: 0,
            selectedDate: new Date(),
            isLoading: true,
            loadingVisitsData: false,
            loadingReportData: false,
            delegateVisits: [],
            filteredDelegateVisits: [],
            kamVisits: [],
            filteredKamVisits: [],
            showReportPanel: true,
            delegateSearchText: '',
            kamSearchText: '',
            supervisors: [],
            totalDelegate: 0,
            sizeDelegate: 100,
            delegatePage: 1,
            totalKam: 0,
            sizeKam: 100,
            kamPage: 1,
            delegateOrder: false,
            kamOrder: false,
        }
    }

    userService =  UserService.getInstance();
    visitService =  VisitService.getInstance();
    reportService =  ReportService.getInstance();
    commandService =  CommandService.getInstance();

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

    loadHomePageData = async () => {

        var currentUser = await this.userService.getMe();

        if (currentUser != undefined) {
            this.setState({ currentUser: currentUser });
        }

        if (currentUser.type === UserType.supervisor) {
            var { visits: visits, total: total } = await this.visitService.getAllVisits(1, 100, new Date(), ClientType.pharmacy, currentUser.id!, this.state.delegateOrder, this.state.delegateProp);
            this.setState({
                isLoading: false,
                delegateVisits: visits,
                filteredDelegateVisits: visits,
                totalDelegate: total,
            });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            this.setState({
                supervisors: supervisors,
            });
            // if (supervisors.length > 0) {
            //     var { visits: kamVisits, total: totalKam } = await this.visitService.getAllVisits(1, 100, new Date(), ClientType.wholesaler, currentUser.id!);

            //     var { visits: delegateVisits, total: totalDelegate } = await this.visitService.getAllVisits(1, 100, new Date(), ClientType.pharmacy, supervisors[0].id!);
            //     this.setState({
            //         isLoading: false,
            //         delegateVisits: delegateVisits,
            //         filteredDelegateVisits: delegateVisits,
            //         kamVisits: kamVisits,
            //         filteredKamVisits: kamVisits,
            //         selectedSupervisor: supervisors[0],
            //         supervisors: supervisors,
            //         totalDelegate: totalDelegate,
            //         totalKam: totalKam,
            //     });
            // }
        }

        this.setState({
            isLoading: false,
        });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadHomePageData();
        }
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, kamPage: 1, delegatePage: 1, selectedVisit: undefined });

        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, date, ClientType.pharmacy, this.state.currentUser.id!, this.state.delegateOrder, this.state.delegateProp);
            this.setState({
                selectedDate: date,
                delegateVisits: visits,
                loadingVisitsData: false,
                filteredDelegateVisits: visits,
                totalDelegate: total,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: delegateVisits, total: totalDelegate } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, date, ClientType.pharmacy, this.state.selectedSupervisor!.id!, this.state.delegateOrder, this.state.delegateProp);
                this.setState({
                    delegateVisits: delegateVisits,
                    filteredDelegateVisits: delegateVisits,
                    totalDelegate: totalDelegate,
                });
            }
            var { visits: kamVisits, total: totalKam } = await this.visitService.getAllVisits(1, this.state.sizeKam, date, ClientType.wholesaler, this.state.currentUser.id!, this.state.kamOrder, this.state.kamProp);
            this.setState({
                selectedDate: date,
                kamVisits: kamVisits,
                filteredKamVisits: kamVisits,
                loadingVisitsData: false,
                kamPage: 1,
                delegatePage: 1,
                totalKam: totalKam,
            });
        }
    }



    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined, delegatePage: 1 });
        var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, this.state.selectedDate, ClientType.pharmacy, supervisor.id!, this.state.delegateOrder, this.state.delegateProp);

        this.setState({
            selectedSupervisor: supervisor,
            delegateVisits: visits,
            loadingVisitsData: false,
            filteredDelegateVisits: visits,
            totalDelegate: total,
            delegatePage: 1,
        });
    }

    handleChangeDelegateProp = async (event: SelectChangeEvent<unknown>) => {
        var delegateProp = event.target.value as string | undefined;
        if (this.state.currentUser.type === UserType.supervisor) {
            this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined, delegatePage: 1 });
            var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, this.state.selectedDate, ClientType.pharmacy, this.state.currentUser.id!, this.state.delegateOrder, delegateProp);

            this.setState({
                delegateVisits: visits,
                loadingVisitsData: false,
                filteredDelegateVisits: visits,
                totalDelegate: total,
                delegateProp: delegateProp,
            });
        }
        else {
            if (this.state.selectedSupervisor) {
                this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined, delegatePage: 1 });
                var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, this.state.selectedDate, ClientType.pharmacy, this.state.selectedSupervisor.id!, this.state.delegateOrder, delegateProp);

                this.setState({
                    delegateVisits: visits,
                    loadingVisitsData: false,
                    filteredDelegateVisits: visits,
                    totalDelegate: total,
                    delegateProp: delegateProp
                });
            }
        }
    }

    handleChangeKamProp = async (event: SelectChangeEvent<unknown>) => {
        var kamProp = event.target.value as string | undefined;
        this.setState({
            loadingVisitsData: true,
            kamPage: 1,
            selectedReport: undefined,
            selectedVisit: undefined,
            selectedCommand: undefined,
            kamProp: kamProp,
        });

        var { visits: kamVisits, total: totalKam } = await this.visitService.getAllVisits(1, this.state.sizeKam, this.state.selectedDate, ClientType.wholesaler, this.state.currentUser.id!, this.state.kamOrder, kamProp);
        this.setState({
            kamVisits: kamVisits,
            filteredKamVisits: kamVisits,
            loadingVisitsData: false,
            totalKam: totalKam,
        });
    }
    handleKamSort = async () => {
        var kamOrder = !this.state.kamOrder;
        this.setState({
            loadingVisitsData: true,
            kamPage: 1,
            selectedReport: undefined,
            selectedVisit: undefined,
            selectedCommand: undefined,
            kamOrder: kamOrder,
        });

        var { visits: kamVisits, total: totalKam } = await this.visitService.getAllVisits(1, this.state.sizeKam, this.state.selectedDate, ClientType.wholesaler, this.state.currentUser.id!, kamOrder, this.state.kamProp);
        this.setState({
            kamVisits: kamVisits,
            filteredKamVisits: kamVisits,
            loadingVisitsData: false,
            totalKam: totalKam,
        });
    }

    handleDelegateSort = async () => {
        var delegateOrder = !this.state.delegateOrder;
        if (this.state.currentUser.type === UserType.supervisor) {
            this.setState({
                loadingVisitsData: true,
                selectedReport: undefined,
                selectedVisit: undefined,
                selectedCommand: undefined,
                delegatePage: 1,
                delegateOrder: delegateOrder
            });
            var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, this.state.selectedDate, ClientType.pharmacy, this.state.currentUser.id!, delegateOrder, this.state.delegateProp);

            this.setState({
                delegateVisits: visits,
                loadingVisitsData: false,
                filteredDelegateVisits: visits,
                totalDelegate: total,
            });
        }
        else {
            if (this.state.selectedSupervisor) {
                this.setState({
                    loadingVisitsData: true,
                    selectedReport: undefined,
                    selectedVisit: undefined,
                    selectedCommand: undefined,
                    delegatePage: 1,
                    delegateOrder: delegateOrder
                });
                var { visits: visits, total: total } = await this.visitService.getAllVisits(1, this.state.sizeDelegate, this.state.selectedDate, ClientType.pharmacy, this.state.selectedSupervisor.id!, delegateOrder, this.state.delegateProp);

                this.setState({
                    delegateVisits: visits,
                    loadingVisitsData: false,
                    filteredDelegateVisits: visits,
                    totalDelegate: total,
                });
            }
        }
    }

    handleDelegateSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ delegateSearchText: event.target.value });
    }

    handleKamSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ kamSearchText: event.target.value });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined });
    };

    handleDelegatePageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: visits, total: total } = await this.visitService.getAllVisits(page, size, this.state.selectedDate, ClientType.pharmacy, this.state.currentUser.id!, this.state.delegateOrder, this.state.delegateProp);
            this.setState({
                delegatePage: page,
                sizeDelegate: size,
                delegateVisits: visits,
                loadingVisitsData: false,
                filteredDelegateVisits: visits,
                totalDelegate: total
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: delegateVisits, total: totalDelegate } = await this.visitService.getAllVisits(page, size, this.state.selectedDate, ClientType.pharmacy, this.state.selectedSupervisor.id!, this.state.delegateOrder, this.state.delegateProp);

                this.setState({
                    delegatePage: page,
                    sizeDelegate: size,
                    delegateVisits: delegateVisits,
                    filteredDelegateVisits: delegateVisits,
                    loadingVisitsData: false,
                    totalDelegate: totalDelegate,
                });
            }
        }
    }

    handleKamPageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, kamPage: page, selectedReport: undefined, selectedVisit: undefined, selectedCommand: undefined });

        var { visits: kamVisits, total: totalKam } = await this.visitService.getAllVisits(page, size, this.state.selectedDate, ClientType.wholesaler, this.state.currentUser.id!, this.state.kamOrder, this.state.kamProp);
        this.setState({
            kamVisits: kamVisits,
            sizeKam: size,
            filteredKamVisits: kamVisits,
            loadingVisitsData: false,
            kamPage: page,
            totalKam: totalKam,
        });

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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Superviseurs" />
                                {
                                    this.state.currentUser.type !== UserType.supervisor ? (<Tab label="Kams" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', width: '100%' }} value={this.state.index} index={0} >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'stretch',
                                alignItems: 'stretch',
                                flexDirection: 'column',
                                flexGrow: '1',
                                height: 'calc(100% - 40px)',
                                width: '100%',
                            }}>

                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px', marginBottom: '16px' }}>
                                    {
                                        this.state.currentUser.type !== UserType.supervisor ? (<div style={{ height: '50px', width: '150px', marginRight: '8px' }}>
                                            <UserDropdown
                                                users={this.state.supervisors}
                                                selectedUser={this.state.selectedSupervisor}
                                                onSelectUser={this.handleSelectSupervisor}
                                                label='Superviseur'
                                            />
                                        </div>) : null
                                    }

                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <DatePickerBar onPick={this.handleOnPickDate} initialDate={this.state.selectedDate}></DatePickerBar>
                                        <div style={{ width: '300px', display: 'flex', position: 'absolute', right: "0px", top: '46px' }}>
                                            <FormControl size="small" style={{
                                                width: '150px',
                                                flex: '1',
                                                backgroundColor: 'white',
                                                height: '40px'
                                            }}>
                                                <InputLabel>Trier avec</InputLabel>
                                                <Select
                                                    label="Trier avec"
                                                    onChange={this.handleChangeDelegateProp}
                                                >
                                                    <MenuItem value={undefined}>
                                                        <em>aucun</em>
                                                    </MenuItem>
                                                    <MenuItem value={'delegate'}>Délégué</MenuItem>
                                                    <MenuItem value={'client'}>Client</MenuItem>
                                                    <MenuItem value={'wilaya'}>wilaya</MenuItem>
                                                    <MenuItem value={'commune'}>Commune</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button variant="outlined"
                                                onClick={() => {
                                                    this.handleDelegateSort();
                                                }}
                                                sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                                {this.state.delegateOrder ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                            </Button>

                                        </div>
                                    </div>

                                </div>

                                <div style={{
                                    width: '100%',
                                    flexGrow: '1',
                                    display: 'flex',
                                    height: 'calc(100% - 100px)'
                                }}>
                                    <HomeTable id='hometable'
                                        total={this.state.totalDelegate}
                                        page={this.state.delegatePage}
                                        size={this.state.sizeDelegate}
                                        pageChange={this.handleDelegatePageChange}
                                        firstHeader='Délégué'
                                        isLoading={this.state.loadingVisitsData}
                                        data={this.state.filteredDelegateVisits}
                                        onDisplayReport={this.handleDisplayReport}
                                        onDisplayCommand={this.handleDisplayCommand}
                                    ></HomeTable>
                                    <div
                                        style={{
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

                                                    <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.selectedReport} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <CommandPanel command={this.state.selectedCommand} ></CommandPanel>
                                                    )
                                        }

                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', width: '100%' }} value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', width: '100%', }}>
                                <div style={{ width: '100%', position: 'relative',marginBottom:'16px' }}>
                                    <DatePickerBar onPick={this.handleOnPickDate} initialDate={this.state.selectedDate}></DatePickerBar>
                                    <div style={{ width: '300px', display: 'flex', position: 'absolute', right: "0px", top: '46px' }}>
                                        <FormControl size="small" style={{
                                            width: '150px',
                                            flex: '1',
                                            backgroundColor: 'white',
                                            height: '40px'
                                        }}>
                                            <InputLabel>Trier avec</InputLabel>
                                            <Select
                                                label="Trier avec"
                                                onChange={this.handleChangeKamProp}
                                            >
                                                <MenuItem value={undefined}>
                                                    <em>aucun</em>
                                                </MenuItem>
                                                <MenuItem value={'delegate'}>Kam</MenuItem>
                                                <MenuItem value={'client'}>Client</MenuItem>
                                                <MenuItem value={'wilaya'}>wilaya</MenuItem>
                                                <MenuItem value={'commune'}>Commune</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button variant="outlined"
                                            onClick={() => {
                                                this.handleKamSort();
                                            }}
                                            sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                            {this.state.delegateOrder ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                        </Button>

                                    </div>
                                </div>

                                <div className='table-panel'>
                                    <HomeTable id='hometable'
                                        firstHeader='Kam'
                                        total={this.state.totalKam}
                                        page={this.state.kamPage}
                                        size={this.state.sizeKam}
                                        pageChange={this.handleKamPageChange}
                                        isLoading={this.state.loadingVisitsData}
                                        data={this.state.filteredKamVisits}
                                        onDisplayReport={this.handleDisplayReport}
                                        onDisplayCommand={this.handleDisplayCommand}
                                    ></HomeTable>
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

                                                    <ReportPanel location={this.state.selectedVisit?.visitLocation} report={this.state.selectedReport} clientType={this.state.selectedVisit?.client?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <CommandPanel command={this.state.selectedCommand} ></CommandPanel>
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



export default HomePage;

