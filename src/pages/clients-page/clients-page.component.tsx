import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import React, { Component } from 'react';
import '../clients-page/clients-page.style.css';
import SearchIcon from '@mui/icons-material/Search';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../services/user.service';
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
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Divider from '@mui/material/Divider';
import StorageIcon from '@mui/icons-material/Storage';
import * as XLSX from 'xlsx';
import ClientService from '../../services/clients.service';

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
    loadingDelegates: boolean;
    wholePage: number;
    sizePharm: number;
    sizeDoc: number;
    sizeWhole: number;
    totalPharm: number;
    totalDoc: number;
    totalWhole: number;
    index: number;
    pharmOrder: boolean;
    docOrder: boolean;
    wholeOrder: boolean;
    pharmProp?: string;
    docProp?: string;
    wholeProp?: string;
    currentUser: UserModel;
    supervisors: UserModel[];
    delegates: UserModel[];
    kams: UserModel[];
    selectedDelegate?: UserModel;
    selectedSupervisor?: UserModel;
}

class ClientsPage extends Component<{}, ClientsPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            loadingDelegates: false,
            delegates: [],
            kams: [],
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
            pharmOrder: false,
            docOrder: false,
            wholeOrder: false,
        }
    }

    userService = UserService.getInstance();
    visitService = VisitService.getInstance();
    reportService = ReportService.getInstance();
    commandService = CommandService.getInstance();
    clientService = ClientService.getInstance();

    exportToExcel = (data: any[], fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    handleExportExcelData = async () => {
        let clients = await this.clientService.getAllClients();
        this.exportToExcel(clients, 'exportedData');
    };

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
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                1,
                25,
                this.state.pharmSearchText,
                ClientType.pharmacy,
                currentUser.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                1,
                25,
                this.state.docSearchText,
                ClientType.doctor,
                currentUser.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );

            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);

            this.setState({
                currentUser: currentUser,
                isLoading: false,
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
                docVisits: docVisits,
                totalDoc: totalDoc,
                delegates: delegates,
            });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, 25, this.state.wholeSearchText, ClientType.wholesaler, currentUser.id!, this.state.wholeOrder, this.state.wholeProp);
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
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                page,
                size,
                this.state.pharmSearchText,
                ClientType.pharmacy,
                this.state.currentUser.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, loadingVisitsData: false, sizePharm: size });
        } else {
            if (this.state.selectedSupervisor) {

                var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                    page,
                    size,
                    this.state.pharmSearchText,
                    ClientType.pharmacy,
                    this.state.selectedSupervisor!.id!,
                    this.state.pharmOrder,
                    this.state.pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({ pharmVisits: pharmVisits, totalPharm: totalPharm, });
            }
            this.setState({ loadingVisitsData: false, sizePharm: size });
        }
    }

    handleWholePageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, wholePage: page, sizeWhole: size });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(page, size, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser.id!, this.state.wholeOrder, this.state.wholeProp);
        this.setState({ wholeVisits: wholeVisits, totalWhole: totalWhole, loadingVisitsData: false, sizeWhole: size });
    }

    handleDocPageChange = async (page: number, size: number) => {
        this.setState({ loadingVisitsData: true, docPage: page, sizeDoc: size });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                page,
                size,
                this.state.docSearchText,
                ClientType.doctor,
                this.state.currentUser.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false, sizeDoc: size });
        } else {
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                page,
                size,
                this.state.docSearchText,
                ClientType.doctor,
                this.state.selectedSupervisor!.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({ docVisits: docVisits, totalDoc: totalDoc, loadingVisitsData: false, sizeDoc: size });
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({
            loadingVisitsData: true,
            docPage: 1,
            pharmPage: 1,
            selectedSupervisor: supervisor,
            loadingDelegates: true,
            selectedDelegate: undefined,
        });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(1, this.state.sizePharm, this.state.pharmSearchText, ClientType.pharmacy, supervisor!.id!, this.state.pharmOrder, this.state.pharmProp);
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeDoc, this.state.docSearchText, ClientType.doctor, supervisor!.id!, this.state.pharmOrder, this.state.pharmProp);
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        this.setState({
            selectedSupervisor: supervisor,
            loadingVisitsData: false,
            loadingDelegates: false,
            pharmVisits: pharmVisits,
            totalPharm: totalPharm,
            docVisits: docVisits,
            totalDoc: totalDoc,
            delegates: delegates,
        });
    }

    handleSelectDelegate = async (delegate: UserModel | undefined) => {
        this.setState({
            loadingVisitsData: true,
            docPage: 1,
            pharmPage: 1,
            selectedDelegate: delegate,
            loadingDelegates: true,
        });
        var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
            1,
            this.state.sizePharm,
            this.state.pharmSearchText,
            ClientType.pharmacy,
            this.state.selectedSupervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp,
            delegate?.id,
        );
        var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
            1,
            this.state.sizeDoc,
            this.state.docSearchText,
            ClientType.doctor,
            this.state.selectedSupervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp,
            delegate?.id,
        );
        this.setState({
            loadingVisitsData: false,
            loadingDelegates: false,
            pharmVisits: pharmVisits,
            totalPharm: totalPharm,
            docVisits: docVisits,
            totalDoc: totalDoc,
        });
    }

    handleSearchPharmacies = async () => {
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizePharm,
                this.state.pharmSearchText,
                ClientType.pharmacy,
                this.state.currentUser!.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizePharm,
                    this.state.pharmSearchText,
                    ClientType.pharmacy,
                    this.state.selectedSupervisor!.id!,
                    this.state.pharmOrder,
                    this.state.pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    pharmVisits: pharmVisits,
                    totalPharm: totalPharm,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleChangePharmProp = async (event: SelectChangeEvent<unknown>) => {
        var pharmProp = event.target.value as string | undefined;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, pharmProp: pharmProp });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizePharm,
                this.state.pharmSearchText,
                ClientType.pharmacy,
                this.state.currentUser!.id!,
                this.state.pharmOrder,
                pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizePharm,
                    this.state.pharmSearchText,
                    ClientType.pharmacy,
                    this.state.selectedSupervisor!.id!,
                    this.state.pharmOrder,
                    pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    pharmVisits: pharmVisits,
                    totalPharm: totalPharm,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }

    handlePharmSort = async () => {
        var pharmOrder = !this.state.pharmOrder;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, pharmOrder: pharmOrder });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizePharm,
                this.state.pharmSearchText,
                ClientType.pharmacy,
                this.state.currentUser!.id!,
                pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmVisits: pharmVisits,
                totalPharm: totalPharm,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: pharmVisits, total: totalPharm } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizePharm,
                    this.state.pharmSearchText,
                    ClientType.pharmacy,
                    this.state.selectedSupervisor!.id!,
                    pharmOrder,
                    this.state.pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    pharmVisits: pharmVisits,
                    totalPharm: totalPharm,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleSearchDoctors = async () => {
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizeDoc,
                this.state.docSearchText,
                ClientType.doctor,
                this.state.currentUser!.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                docVisits: docVisits,
                totalDoc: totalDoc,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizeDoc,
                    this.state.docSearchText,
                    ClientType.doctor,
                    this.state.selectedSupervisor!.id!,
                    this.state.docOrder,
                    this.state.docProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    docVisits: docVisits,
                    totalDoc: totalDoc,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleChangeDocProp = async (event: SelectChangeEvent<unknown>) => {
        var docProp = event.target.value as string | undefined;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, docProp: docProp });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizeDoc,
                this.state.docSearchText,
                ClientType.doctor,
                this.state.currentUser!.id!,
                this.state.docOrder,
                docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                docVisits: docVisits,
                totalDoc: totalDoc,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizeDoc,
                    this.state.docSearchText,
                    ClientType.doctor,
                    this.state.selectedSupervisor!.id!,
                    this.state.docOrder,
                    docProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    docVisits: docVisits,
                    totalDoc: totalDoc,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }
    handleDocSort = async () => {
        var docOrder = !this.state.docOrder;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, docOrder: docOrder });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                1,
                this.state.sizeDoc,
                this.state.docSearchText,
                ClientType.doctor,
                this.state.currentUser!.id!,
                docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                docVisits: docVisits,
                totalDoc: totalDoc,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { visits: docVisits, total: totalDoc } = await this.visitService.getAllVisitsPaginated(
                    1,
                    this.state.sizeDoc,
                    this.state.docSearchText,
                    ClientType.doctor,
                    this.state.selectedSupervisor!.id!,
                    docOrder,
                    this.state.docProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    docVisits: docVisits,
                    totalDoc: totalDoc,
                });
            }
        }

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleSearchWholesalers = async () => {
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeWhole, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser!.id!, this.state.wholeOrder, this.state.wholeProp);
        this.setState({
            wholeVisits: wholeVisits,
            totalWhole: totalWhole,

        });

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleChangeWholeProp = async (event: SelectChangeEvent<unknown>) => {
        var wholeProp = event.target.value as string | undefined;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, wholeProp: wholeProp });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeWhole, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser!.id!, this.state.wholeOrder, wholeProp);
        this.setState({
            wholeVisits: wholeVisits,
            totalWhole: totalWhole,

        });

        this.setState({
            loadingVisitsData: false,
        });
    }

    handleWholeSort = async () => {
        var wholeOrder = !this.state.wholeOrder;
        this.setState({ loadingVisitsData: true, docPage: 1, pharmPage: 1, wholeOrder: wholeOrder });
        var { visits: wholeVisits, total: totalWhole } = await this.visitService.getAllVisitsPaginated(1, this.state.sizeWhole, this.state.wholeSearchText, ClientType.wholesaler, this.state.currentUser!.id!, wholeOrder, this.state.wholeProp);
        this.setState({
            wholeVisits: wholeVisits,
            totalWhole: totalWhole,

        });

        this.setState({
            loadingVisitsData: false,
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
                                    this.state.currentUser.type !== UserType.supervisor ? (<Tab label="Grossiste" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
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

                                    <div style={{ height: '50px', width: '150px', }}>
                                        <UserDropdown
                                            users={this.state.delegates}
                                            selectedUser={this.state.selectedDelegate}
                                            onSelectUser={this.handleSelectDelegate}
                                            label='Délégué'
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />
                                    <FormControl size="small" style={{
                                        width: '150px',
                                        backgroundColor: 'white',
                                        marginLeft: "8px",
                                        height: '40px'
                                    }}>
                                        <InputLabel>Trier avec</InputLabel>
                                        <Select
                                            label="Trier avec"
                                            onChange={this.handleChangePharmProp}
                                        >
                                            <MenuItem value={undefined}>
                                                <em>aucun</em>
                                            </MenuItem>
                                            <MenuItem value={'date'}>Date</MenuItem>
                                            <MenuItem value={'client'}>Client</MenuItem>
                                            <MenuItem value={'delegate'}>Délégué</MenuItem>
                                            <MenuItem value={'wilaya'}>wilaya</MenuItem>
                                            <MenuItem value={'commune'}>Commune</MenuItem>
                                            <MenuItem value={'visitsNum'}>Nombre de visites</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handlePharmSort();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        {this.state.pharmOrder ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </Button>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />
                                    <TextField
                                        onChange={(event) => {
                                            this.setState({ pharmSearchText: event.target.value })
                                        }}
                                        value={this.state.pharmSearchText}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}
                                        placeholder='Recherche'
                                        size="small" />
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handleSearchPharmacies();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        <SearchIcon />
                                    </Button>
                                    {
                                        this.state.currentUser.type === UserType.admin ?
                                            (
                                                <>
                                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />
                                                    <Button variant="outlined"
                                                        onClick={() => {
                                                            this.handleExportExcelData();
                                                        }}
                                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                                        <StorageIcon />
                                                    </Button>
                                                </>
                                            ) : null
                                    }
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 55px)', }}>
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
                        <CustomTabPanel value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
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
                                    <div style={{ height: '50px', width: '150px', }}>
                                        <UserDropdown
                                            users={this.state.delegates}
                                            selectedUser={this.state.selectedDelegate}
                                            onSelectUser={this.handleSelectDelegate}
                                            label='Délégué'
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />

                                    <FormControl size="small" style={{
                                        width: '150px',
                                        backgroundColor: 'white',
                                        marginLeft: "8px",
                                        height: '40px'
                                    }}>
                                        <InputLabel>Trier avec</InputLabel>
                                        <Select
                                            label="Trier avec"
                                            onChange={this.handleChangeDocProp}
                                        >
                                            <MenuItem value={undefined}>
                                                <em>aucun</em>
                                            </MenuItem>
                                            <MenuItem value={'date'}>Date</MenuItem>
                                            <MenuItem value={'client'}>Client</MenuItem>
                                            <MenuItem value={'delegate'}>Délégué</MenuItem>
                                            <MenuItem value={'wilaya'}>wilaya</MenuItem>
                                            <MenuItem value={'commune'}>Commune</MenuItem>
                                            <MenuItem value={'visitsNum'}>Nombre de visites</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handleDocSort();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        {this.state.docOrder ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </Button>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />

                                    <TextField
                                        onChange={(event) => {
                                            this.setState({ docSearchText: event.target.value })
                                        }}
                                        value={this.state.docSearchText}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}
                                        placeholder='Recherche'
                                        size="small" />
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handleSearchDoctors();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        <SearchIcon />
                                    </Button>
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 55px)' }}>

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
                        <CustomTabPanel value={this.state.index} index={2} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px', marginBottom: '8px' }}>
                                    <FormControl size="small" style={{
                                        width: '150px',
                                        backgroundColor: 'white',
                                        marginLeft: "8px",
                                        height: '40px'
                                    }}>
                                        <InputLabel>Trier avec</InputLabel>
                                        <Select
                                            label="Trier avec"
                                            onChange={this.handleChangeWholeProp}
                                        >
                                            <MenuItem value={undefined}>
                                                <em>aucun</em>
                                            </MenuItem>
                                            <MenuItem value={'date'}>Date</MenuItem>
                                            <MenuItem value={'client'}>Client</MenuItem>
                                            <MenuItem value={'delegate'}>Délégué</MenuItem>
                                            <MenuItem value={'wilaya'}>wilaya</MenuItem>
                                            <MenuItem value={'commune'}>Commune</MenuItem>
                                            <MenuItem value={'visitsNum'}>Nombre de visites</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handleWholeSort();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        {this.state.wholeOrder ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </Button>
                                    <Divider orientation="vertical" flexItem component="div" style={{ width: '0.5%' }} sx={{ borderRight: 'solid rgba(127,127,127,0.5) 1px', margin: '8px 8px 16px 8px' }} />
                                    <TextField
                                        onChange={(event) => {
                                            this.setState({ wholeSearchText: event.target.value })
                                        }}
                                        value={this.state.wholeSearchText}
                                        sx={{
                                            backgroundColor: 'white',
                                            marginLeft: "8px",
                                            height: '40px'
                                        }}
                                        placeholder='Recherche'
                                        size="small" />
                                    <Button variant="outlined"
                                        onClick={() => {
                                            this.handleSearchWholesalers();
                                        }}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}>
                                        <SearchIcon />
                                    </Button>

                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 55px)' }}>
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
