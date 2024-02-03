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
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ClientsDoctorTable from '../../components/clients-doctor-table/clients-doctor-table.component';
import ClientModel, { ClientType } from '../../models/client.model';
import UserModel, { UserType } from '../../models/user.model';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
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
import VisitTable from '../../components/visit-table/visit-table.component';
import ReportPanel from '../../components/report-panel/report-panel.component';
import TextField from '@mui/material/TextField';

interface ClientsPageProps {
    selectedDate: Date;
    isLoading: boolean;
    loadingVisitsData: boolean;
    loadingClientsData: boolean;
    showVisitPanel: boolean;
    pharmClients: ClientModel[];
    pharmVisits: VisitModel[];
    docClients: ClientModel[];
    docVisits: VisitModel[];
    wholeClients: ClientModel[];
    wholeVisits: VisitModel[];
    selectedClient?: ClientModel;
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
    selectedUserId?: number;
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
    pharmSearchText: string;
    docSearchText: string;
    wholeSearchText: string;
}

class ClientsPage extends Component<{}, ClientsPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            loadingDelegates: false,
            loadingClientsData: false,
            delegates: [],
            kams: [],
            docClients: [],
            pharmClients: [],
            wholeClients: [],
            pharmVisits: [],
            docVisits: [],
            wholeVisits: [],
            loadingVisitsData: false,
            showVisitPanel: false,
            pharmPage: 1,
            docPage: 1,
            wholePage: 1,
            sizeDoc: 100,
            sizePharm: 100,
            sizeWhole: 100,
            totalPharm: 0,
            totalDoc: 0,
            totalWhole: 0,
            index: 0,
            supervisors: [],
            pharmOrder: false,
            docOrder: false,
            wholeOrder: false,
            pharmSearchText: '',
            docSearchText: '',
            wholeSearchText: '',
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

    handleDisplayPharmVisits = async (client: ClientModel) => {
        this.setState({ loadingVisitsData: true, pharmReportData: undefined, showVisitPanel: true });
        var { visits, total } = await this.visitService.getAllVisitsPaginated(client.id!, this.state.selectedSupervisor?.id ?? this.state.currentUser!.id!, this.state.selectedDelegate?.id);
        this.setState({ loadingVisitsData: false, pharmVisits: visits, selectedClient: client, showVisitPanel: true });
    };

    handleDisplayWholeVisits = async (client: ClientModel) => {
        this.setState({ loadingVisitsData: true, wholeReportData: undefined, showVisitPanel: true });
        var { visits, total } = await this.visitService.getAllVisitsPaginated(client.id!, 0,);
        this.setState({ loadingVisitsData: false, wholeVisits: visits, selectedClient: client, showVisitPanel: true });

    };

    handleDisplayDocVisits = async (client: ClientModel) => {
        this.setState({ loadingVisitsData: true, docReportData: undefined, showVisitPanel: true });
        var { visits, total } = await this.visitService.getAllVisitsPaginated(client.id!, this.state.selectedSupervisor?.id ?? this.state.currentUser!.id!, this.state.selectedDelegate?.id);
        this.setState({ loadingVisitsData: false, docVisits: visits, selectedClient: client, showVisitPanel: true });
    };

    loadClientsPageData = async () => {
        var currentUser = await this.userService.getMe();
        if (currentUser.type === UserType.supervisor) {
            var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                this.state.pharmPage,
                this.state.sizePharm,
                ClientType.pharmacy,
                this.state.pharmSearchText,
                currentUser.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id);
            var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                this.state.docPage,
                this.state.sizeDoc,
                ClientType.doctor,
                this.state.docSearchText,
                currentUser.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id);
            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);

            this.setState({
                currentUser: currentUser,
                isLoading: false,
                pharmClients: pharmClients,
                totalPharm: totalPharm,
                docClients: docClients,
                totalDoc: totalDoc,
                delegates: delegates,
            });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            var { clients: wholeClients, total: totalWhole } = await this.clientService.getClientsPaginated(
                this.state.wholePage,
                this.state.sizeWhole,
                ClientType.wholesaler,
                this.state.pharmSearchText,
                currentUser.id!,
                this.state.wholeOrder,
                this.state.wholeProp);
            this.setState({
                wholeClients: wholeClients,
                totalWhole: totalWhole,
                supervisors: supervisors,
                currentUser: currentUser,
                isLoading: false,

            });
        }

    };

    handlePharmPageChange = async (page: number, size: number) => {
        this.setState({ loadingClientsData: true, pharmPage: page, sizePharm: size, showVisitPanel: false, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                page,
                size,
                ClientType.pharmacy,
                this.state.pharmSearchText,
                this.state.currentUser.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmClients: pharmClients,
                totalPharm: totalPharm,
                loadingClientsData: false,
                sizePharm: size
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                    page,
                    size,
                    ClientType.pharmacy,
                    this.state.pharmSearchText,
                    this.state.selectedSupervisor!.id!,
                    this.state.pharmOrder,
                    this.state.pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({ pharmClients: pharmClients, totalPharm: totalPharm, });
            }
            this.setState({ loadingClientsData: false, sizePharm: size });
        }
    }

    handleWholePageChange = async (page: number, size: number) => {
        this.setState({ loadingClientsData: true, wholePage: page, sizeWhole: size, showVisitPanel: false, });
        var { clients: wholeClients, total: totalWhole } = await this.clientService.getClientsPaginated(
            page,
            size,
            ClientType.wholesaler,
            this.state.wholeSearchText,
            this.state.currentUser.id!,
            this.state.wholeOrder,
            this.state.wholeProp);
        this.setState({ wholeClients: wholeClients, totalWhole: totalWhole, loadingClientsData: false, sizeWhole: size });
    }

    handleDocPageChange = async (page: number, size: number) => {
        this.setState({ loadingClientsData: true, docPage: page, sizeDoc: size, showVisitPanel: false, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                page,
                size,
                ClientType.doctor,
                this.state.docSearchText,
                this.state.currentUser.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({ docClients: docClients, totalDoc: totalDoc, loadingClientsData: false, sizeDoc: size });
        } else {
            var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                page,
                size,
                ClientType.doctor,
                this.state.docSearchText,
                this.state.selectedSupervisor!.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({ docClients: docClients, totalDoc: totalDoc, loadingClientsData: false, sizeDoc: size });
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, showVisitPanel: false, });
    };

    handleSelectSupervisor = async (supervisor?: UserModel) => {
        this.setState({
            loadingClientsData: true,
            docPage: 1,
            pharmPage: 1,
            selectedSupervisor: supervisor,
            loadingDelegates: true,
            selectedDelegate: undefined,
            showVisitPanel: false,
        });
        var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizePharm,
            ClientType.pharmacy,
            this.state.pharmSearchText,
            supervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp);
        var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizeDoc,
            ClientType.doctor,
            this.state.docSearchText,
            supervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp);
        var delegates = await this.userService.getUsersByCreator(supervisor!.id!, UserType.delegate);
        this.setState({
            selectedSupervisor: supervisor,
            loadingClientsData: false,
            loadingDelegates: false,
            pharmClients: pharmClients,
            totalPharm: totalPharm,
            docClients: docClients,
            totalDoc: totalDoc,
            delegates: delegates,
        });
    }

    handleSelectDelegate = async (delegate?: UserModel) => {
        this.setState({
            loadingClientsData: true,
            docPage: 1,
            pharmPage: 1,
            selectedDelegate: delegate,
            loadingDelegates: true,
            showVisitPanel: false,
        });
        var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizePharm,
            ClientType.pharmacy,
            this.state.pharmSearchText,
            this.state.selectedSupervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp,
            delegate?.id,
        );
        var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizeDoc,
            ClientType.doctor,
            this.state.docSearchText,
            this.state.selectedSupervisor!.id!,
            this.state.pharmOrder,
            this.state.pharmProp,
            delegate?.id,
        );
        this.setState({
            loadingClientsData: false,
            loadingDelegates: false,
            pharmClients: pharmClients,
            totalPharm: totalPharm,
            docClients: docClients,
            totalDoc: totalDoc,
        });
    }

    handlePharmSort = async (field: string, order: boolean) => {
        this.setState({ loadingClientsData: true, docPage: 1, pharmPage: 1, pharmProp: field, showVisitPanel: false, pharmOrder: order });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                1,
                this.state.sizePharm,
                ClientType.pharmacy,
                this.state.pharmSearchText,
                this.state.currentUser!.id!,
                order,
                field,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmClients: pharmClients,
                totalPharm: totalPharm,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                    1,
                    this.state.sizePharm,
                    ClientType.pharmacy,
                    this.state.pharmSearchText,
                    this.state.selectedSupervisor!.id!,
                    order,
                    field,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    pharmClients: pharmClients,
                    totalPharm: totalPharm,
                });
            }
        }

        this.setState({
            loadingClientsData: false,
        });
    }

    handleSearchPharmacies = async () => {
        this.setState({ loadingClientsData: true, pharmPage: 1, showVisitPanel: false, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                1,
                this.state.sizePharm,
                ClientType.pharmacy,
                this.state.pharmSearchText,
                this.state.currentUser!.id!,
                this.state.pharmOrder,
                this.state.pharmProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                pharmClients: pharmClients,
                totalPharm: totalPharm,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { clients: pharmClients, total: totalPharm } = await this.clientService.getClientsPaginated(
                    1,
                    this.state.sizePharm,
                    ClientType.pharmacy,
                    this.state.pharmSearchText,
                    this.state.selectedSupervisor!.id!,
                    this.state.pharmOrder,
                    this.state.pharmProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    pharmClients: pharmClients,
                    totalPharm: totalPharm,
                });
            }
        }

        this.setState({
            loadingClientsData: false,
        });
    }


    handleDocSort = async (field: string, order: boolean) => {
        this.setState({ loadingClientsData: true, docPage: 1, pharmPage: 1, docProp: field, docOrder: order, showVisitPanel: false, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                1,
                this.state.sizeDoc,
                ClientType.doctor,
                this.state.docSearchText,
                this.state.currentUser!.id!,
                order,
                field,
                this.state.selectedDelegate?.id
            );
            this.setState({
                docClients: docClients,
                totalDoc: totalDoc,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                    1,
                    this.state.sizeDoc,
                    ClientType.doctor,
                    this.state.docSearchText,
                    this.state.selectedSupervisor!.id!,
                    order,
                    field,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    docClients: docClients,
                    totalDoc: totalDoc,
                });
            }
        }

        this.setState({
            loadingClientsData: false,
        });
    }
    handleSearchDoctors = async () => {
        this.setState({ loadingClientsData: true, docPage: 1, showVisitPanel: false, });
        if (this.state.currentUser.type === UserType.supervisor) {
            var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                1,
                this.state.sizeDoc,
                ClientType.doctor,
                this.state.docSearchText,
                this.state.currentUser!.id!,
                this.state.docOrder,
                this.state.docProp,
                this.state.selectedDelegate?.id
            );
            this.setState({
                docClients: docClients,
                totalDoc: totalDoc,
            });
        } else {
            if (this.state.selectedSupervisor) {
                var { clients: docClients, total: totalDoc } = await this.clientService.getClientsPaginated(
                    1,
                    this.state.sizeDoc,
                    ClientType.doctor,
                    this.state.docSearchText,
                    this.state.selectedSupervisor!.id!,
                    this.state.docOrder,
                    this.state.docProp,
                    this.state.selectedDelegate?.id
                );
                this.setState({
                    docClients: docClients,
                    totalDoc: totalDoc,
                });
            }
        }

        this.setState({
            loadingClientsData: false,
        });
    }

    handleWholeSort = async (field: string, order: boolean) => {
        this.setState({ loadingClientsData: true, wholePage: 1, wholeProp: field, wholeOrder: order, showVisitPanel: false, });
        var { clients: wholeClients, total: totalWhole } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizeWhole,
            ClientType.wholesaler,
            this.state.wholeSearchText,
            this.state.currentUser!.id!,
            order,
            field);
        this.setState({
            wholeClients: wholeClients,
            totalWhole: totalWhole,
            loadingClientsData: false,
        });
    }

    handleSearchWholesalers = async () => {
        this.setState({ loadingClientsData: true, wholePage: 1, showVisitPanel: false, });
        var { clients: wholeClients, total: totalWhole } = await this.clientService.getClientsPaginated(
            1,
            this.state.sizeWhole,
            ClientType.wholesaler,
            this.state.wholeSearchText,
            this.state.currentUser!.id!,
            this.state.wholeOrder,
            this.state.wholeProp,
        );
        this.setState({
            wholeClients: wholeClients,
            totalWhole: totalWhole,
            loadingClientsData: false,
        });
    }

    handleDisplayReportPharm = async (visit: VisitModel) => {
        this.setState({ loadingVisitsData: true, });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({
            loadingVisitsData: false,
            pharmReportData: report,
        });
    }

    handleDisplayReportDoc = async (visit: VisitModel) => {
        this.setState({ loadingVisitsData: true, });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({
            loadingVisitsData: false,
            docReportData: report,
        });
    }

    handleDisplayReportWhole = async (visit: VisitModel) => {
        this.setState({ loadingVisitsData: true, });
        var report = await this.reportService.getReportOfVisit(visit.id!);
        this.setState({
            loadingVisitsData: false,
            wholeReportData: report,
        });
    }

    handleDisplayCommandPharm = async (visit: VisitModel) => {
        this.setState({ loadingVisitsData: true, });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({
            loadingVisitsData: false,
            pharmCommandData: command,
        });
    }
    handleDisplayCommandWhole = async (visit: VisitModel) => {
        this.setState({ loadingVisitsData: true, });
        var command = await this.commandService.getCommandOfVisit(visit.id!);
        this.setState({
            loadingVisitsData: false,
            wholeCommandData: command,
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
                                            isNullable={true}
                                            selectedUser={this.state.selectedDelegate}
                                            onSelectUser={this.handleSelectDelegate}
                                            label='Délégué'
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
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
                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexGrow: '1',
                                    height: 'calc(100% - 55px)',
                                }}>
                                    <ClientsPharmacyTable
                                        total={this.state.totalPharm}
                                        page={this.state.pharmPage}
                                        size={this.state.sizePharm}
                                        pageChange={this.handlePharmPageChange}
                                        id='clients-pharmacy-table'
                                        data={this.state.pharmClients}
                                        isLoading={this.state.loadingClientsData}
                                        displayVisits={this.handleDisplayPharmVisits}
                                        sortChange={this.handlePharmSort}
                                        sorting={{ field: this.state.pharmProp ?? '', order: this.state.pharmOrder }}
                                    ></ClientsPharmacyTable>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                        {
                                            this.state.loadingVisitsData ?
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
                                                this.state.showVisitPanel ? this.state.pharmReportData ? (
                                                    <ReportPanel
                                                        showBackButton={true}
                                                        onBackClick={() => {
                                                            this.setState({ pharmReportData: undefined });
                                                        }}
                                                        report={this.state.pharmReportData}
                                                        clientType={this.state.selectedClient?.type}></ReportPanel>
                                                ) : this.state.pharmCommandData ? (
                                                    <CommandPanel
                                                        showBackButton={true}
                                                        onBackClick={() => {
                                                            this.setState({ pharmCommandData: undefined });
                                                        }}
                                                        command={this.state.pharmCommandData} ></CommandPanel>
                                                ) : (
                                                    <div style={{
                                                        height: '100%'
                                                    }}>
                                                        <FormControl size="small" style={{
                                                            width: '200px',
                                                            backgroundColor: 'white',
                                                            margin: "8px",
                                                            height: '40px'
                                                        }}>
                                                            <InputLabel>Délégués de visites</InputLabel>
                                                            <Select
                                                                label="Trier avec"
                                                                value={this.state.selectedDelegate?.id}
                                                                disabled={this.state.selectedDelegate !== undefined}
                                                                onChange={(event) => {
                                                                    var id = event.target.value as number | undefined;
                                                                    this.setState({ selectedUserId: id });
                                                                }}>
                                                                <MenuItem value={undefined}>
                                                                    <em>aucun</em>
                                                                </MenuItem>
                                                                {
                                                                    Array.from(new Set(this.state.pharmVisits.map(visit => visit.user?.id))).map(userId => (
                                                                        <MenuItem key={userId} value={userId}>
                                                                            {this.state.pharmVisits.find(visit => visit.user?.id === userId)?.user?.username}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        <VisitTable
                                                            isLoading={this.state.loadingVisitsData}
                                                            data={this.state.selectedUserId ? this.state.pharmVisits.filter((v) => v.user?.id === this.state.selectedUserId) : this.state.pharmVisits}
                                                            displayReport={this.handleDisplayReportPharm}
                                                            displayCommand={this.handleDisplayCommandPharm}
                                                        ></VisitTable>
                                                    </div>
                                                ) : null

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
                                        data={this.state.docClients}
                                        isLoading={this.state.loadingClientsData}
                                        displayVisits={this.handleDisplayDocVisits}
                                        sortChange={this.handleDocSort}
                                        sorting={{ field: this.state.docProp ?? '', order: this.state.docOrder }}
                                    ></ClientsDoctorTable>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                        {
                                            this.state.loadingVisitsData ?
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
                                                this.state.showVisitPanel ? this.state.docReportData ? (
                                                    <ReportPanel
                                                        showBackButton={true}
                                                        onBackClick={() => {
                                                            this.setState({ docReportData: undefined });
                                                        }}
                                                        report={this.state.docReportData}
                                                        clientType={this.state.selectedClient?.type}></ReportPanel>
                                                ) :
                                                    (
                                                        <div style={{
                                                            height: '100%'
                                                        }}>
                                                            <FormControl size="small" style={{
                                                                width: '200px',
                                                                backgroundColor: 'white',
                                                                margin: "8px",
                                                                height: '40px'
                                                            }}>
                                                                <InputLabel>Délégués de visites</InputLabel>
                                                                <Select
                                                                    label="Trier avec"
                                                                    value={this.state.selectedDelegate?.id}
                                                                    disabled={this.state.selectedDelegate !== undefined}
                                                                    onChange={(event) => {
                                                                        var id = event.target.value as number | undefined;
                                                                        this.setState({ selectedUserId: id });
                                                                    }}>
                                                                    <MenuItem value={undefined}>
                                                                        <em>aucun</em>
                                                                    </MenuItem>
                                                                    {
                                                                        Array.from(new Set(this.state.docVisits.map(visit => visit.user?.id))).map(userId => (
                                                                            <MenuItem key={userId} value={userId}>
                                                                                {this.state.docVisits.find(visit => visit.user?.id === userId)?.user?.username}
                                                                            </MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                            <VisitTable
                                                                isLoading={this.state.loadingVisitsData}
                                                                isDoctor={true}
                                                                data={this.state.selectedUserId ? this.state.docVisits.filter((v) => v.user?.id === this.state.selectedUserId) : this.state.docVisits}
                                                                displayReport={this.handleDisplayReportDoc}
                                                            ></VisitTable>
                                                        </div>
                                                    ) : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={this.state.index} index={2} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px' }}>
                                    <TextField
                                        onChange={(event) => {
                                            this.setState({ wholeSearchText: event.target.value })
                                        }}
                                        value={this.state.wholeSearchText}
                                        sx={{ backgroundColor: 'white', marginLeft: "8px", height: '40px' }}
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
                                        data={this.state.wholeClients}
                                        isLoading={this.state.loadingClientsData}
                                        displayVisits={this.handleDisplayWholeVisits}
                                        sortChange={this.handleWholeSort}
                                        sorting={{ field: this.state.wholeProp ?? '', order: this.state.wholeOrder }}
                                    ></ClientsPharmacyTable>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                        {
                                            this.state.loadingVisitsData ?
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
                                                this.state.showVisitPanel ? this.state.wholeReportData ? (
                                                    <ReportPanel
                                                        showBackButton={true}
                                                        onBackClick={() => {
                                                            this.setState({ wholeReportData: undefined });
                                                        }}
                                                        report={this.state.wholeReportData}
                                                        clientType={this.state.selectedClient?.type}></ReportPanel>
                                                ) : this.state.wholeCommandData ? (
                                                    <CommandPanel
                                                        showBackButton={true}
                                                        onBackClick={() => {
                                                            this.setState({ wholeCommandData: undefined });
                                                        }}
                                                        command={this.state.wholeCommandData} ></CommandPanel>
                                                ) : (
                                                    <div style={{
                                                        height: '100%'
                                                    }}>
                                                        <FormControl size="small" style={{
                                                            width: '200px',
                                                            backgroundColor: 'white',
                                                            margin: "8px",
                                                            height: '40px'
                                                        }}>
                                                            <InputLabel>Délégués de visites</InputLabel>
                                                            <Select
                                                                label="Trier avec"
                                                                onChange={(event) => {
                                                                    var id = event.target.value as number | undefined;
                                                                    this.setState({ selectedUserId: id });
                                                                }}>
                                                                <MenuItem value={undefined}>
                                                                    <em>aucun</em>
                                                                </MenuItem>
                                                                {
                                                                    Array.from(new Set(this.state.wholeVisits.map(visit => visit.user?.id))).map(userId => (
                                                                        <MenuItem key={userId} value={userId}>
                                                                            {this.state.wholeVisits.find(visit => visit.user?.id === userId)?.user?.username}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        <VisitTable
                                                            isLoading={this.state.loadingVisitsData}
                                                            data={this.state.selectedUserId ? this.state.wholeVisits.filter((v) => v.user?.id === this.state.selectedUserId) : this.state.wholeVisits}
                                                            displayReport={this.handleDisplayReportWhole}
                                                            displayCommand={this.handleDisplayCommandWhole}
                                                        ></VisitTable>
                                                    </div>
                                                ) : null
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
