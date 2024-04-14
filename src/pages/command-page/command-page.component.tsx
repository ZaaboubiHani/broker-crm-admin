import React, { Component } from 'react';
import '../command-page/command-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import CommandDelegateTable from '../../components/command-delegate-table/command-delegate-table.component';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../services/user.service';
import CommandService from '../../services/command.service';
import UserModel, { UserType } from '../../models/user.model';
import CommandModel from '../../models/command.model';
import CommandPanel from '../../components/comand-panel/command-panel.component';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import CommandCamTable from '../../components/command-cam-table/command-cam-table.component';
import SupplierModel from '../../models/supplier.model';
import SupplierService from '../../services/supplier.service';
import CompoundBox, { RenderDirection } from '../../components/compound-box/compound-box.component';
import Button from '@mui/material/Button/Button';
import StorageIcon from '@mui/icons-material/Storage';
import * as XLSX from 'xlsx';
import ProductModel from '@/src/models/product.model';
import ClientModel from '@/src/models/client.model';
import { formatDateToYYYYMMDD } from '../../functions/date-format';


interface CommandDelegatePageProps {
    selectedDateDelegate: Date;
    selectedDateKam: Date;
    isLoading: boolean;
    loadingDelegates: boolean;
    showDialog: boolean;
    showSuppliersDialog: boolean;
    dialogMessage: string;
    loadingDelegateCommandsData: boolean;
    loadingKamCommandsData: boolean;
    delegateCommands: CommandModel[];
    kamCommands: CommandModel[];
    delegateCommandData?: CommandModel;
    kamCommandData?: CommandModel;
    delegateSearchText: string;
    kamSearchText: string;
    delegates: UserModel[];
    kams: UserModel[];
    supervisors: UserModel[];
    suppliers: SupplierModel[];
    selectedSupervisor?: UserModel;
    selectedDelegate?: UserModel;
    selectedKam?: UserModel;
    loadingDelegateCommandData?: boolean;
    loadingKamCommandData?: boolean;
    index: number,
    currentUser: UserModel;
    totalDelegate: number;
    sizeDelegate: number;
    delegatePage: number;
    totalKam: number;
    sizeKam: number;
    kamPage: number;
    commandIndex: number;
    loadingExcelData: boolean;
}

class CommandPage extends Component<{}, CommandDelegatePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            supervisors: [],
            selectedDateDelegate: new Date(),
            selectedDateKam: new Date(),
            delegateSearchText: '',
            kamSearchText: '',
            dialogMessage: '',
            loadingDelegates: false,
            isLoading: true,
            showDialog: false,
            loadingDelegateCommandsData: false,
            loadingKamCommandsData: false,
            delegateCommands: [],
            kamCommands: [],
            delegates: [],
            kams: [],
            index: 0,
            totalDelegate: 0,
            sizeDelegate: 100,
            delegatePage: 1,
            totalKam: 0,
            sizeKam: 100,
            kamPage: 1,
            suppliers: [],
            commandIndex: -1,
            showSuppliersDialog: false,
            loadingExcelData: false,
        }
    }

    userService = UserService.getInstance();
    commandService = CommandService.getInstance();
    supplierService = SupplierService.getInstance();

    handleCloseDialog = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ showDialog: false, });
    };


    handleSelectDelegate = async (delegate?: UserModel) => {
        this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined, delegatePage: 1 });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, this.state.sizeDelegate, this.state.selectedDateDelegate, delegate!.id!);
        this.setState({ selectedDelegate: delegate, delegateCommands: commands, delegatePage: 1, totalDelegate: total, loadingDelegateCommandsData: false, });
    }

    handleSelectKam = async (kam?: UserModel) => {
        this.setState({ loadingKamCommandsData: true, kamCommandData: undefined, kamPage: 1 });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, this.state.sizeKam, this.state.selectedDateKam, kam!.id!);
        this.setState({ selectedKam: kam, kamCommands: commands, kamPage: 1, totalKam: total, loadingKamCommandsData: false, });
    }

    handleOnPickDateDelegate = async (date: Date) => {
        this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined, delegatePage: 1 });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, this.state.sizeDelegate, date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDateDelegate: date, delegateCommands: commands, delegatePage: 1, totalDelegate: total, loadingDelegateCommandsData: false, });
    }

    handleOnPickDateKam = async (date: Date) => {
        this.setState({ loadingKamCommandsData: true, kamCommandData: undefined, kamPage: 1 });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, this.state.sizeKam, date, this.state.selectedKam!.id!);
        this.setState({ selectedDateKam: date, kamCommands: commands, kamPage: 1, totalKam: total, loadingKamCommandsData: false, });
    }

    loadCommandPageData = async () => {
        if (this.state.currentUser === undefined) {
            var currentUser = await this.userService.getMe();
            this.setState({ currentUser: currentUser });
        }
        else {
            if (this.state.currentUser.type === UserType.supervisor) {
                var delegates = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.delegate);

                this.setState({ isLoading: false, delegates: delegates, });
            } else {
                var supervisors = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.supervisor);
                var kams = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.kam);
                var suppliers = await this.supplierService.getAllSuppliers();
                this.setState({
                    isLoading: false,
                    supervisors: supervisors,
                    kams: kams,
                    suppliers: suppliers,
                });
            }
        }
    }

    handleDisplayDelegateCommand = async (command: CommandModel) => {
        this.setState({ delegateCommandData: command });
    }

    handleDisplayKamCommand = async (command: CommandModel) => {
        this.setState({ kamCommandData: command });
    }

    handleHonorDelegateCommand = async (command: CommandModel) => {
        if (command.isHonored && command.finalSupplier !== undefined) {
            await this.commandService.honorCommand(command!.id!, command!.finalSupplier!.id!);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande honoré' });
        }
        else if (command.isHonored && command.finalSupplier === undefined) {
            this.setState({ showDialog: true, dialogMessage: 'Vous ne pouvez pas honorer sans un fournisseur' });
        }
        else if (!command.isHonored) {
            await this.commandService.dishonorCommand(command!.id!);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande dishonoré' });
        }
    }

    handleHonorKamCommand = async (command: CommandModel) => {
        if (command.isHonored) {
            await this.commandService.honorCommand(command!.id!, command!.finalSupplier?.id);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande honoré' });
        }
        else if (!command.isHonored) {
            await this.commandService.dishonorCommand(command!.id!);
            this.setState({ showDialog: true, dialogMessage: 'Bon de commande dishonoré' });
        }
    }

    handleSelectSupervisor = async (supervisor?: UserModel) => {
        this.setState({
            delegateCommandData: undefined,
            delegates: [],
            delegateCommands: [],
            loadingDelegates: true,
        });
        var delegates = await this.userService.getUsersByCreator(supervisor!.id!, UserType.delegate);

        this.setState({
            delegates: delegates,
            loadingDelegates: false,
        });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };


    handleDelegatePageChange = async (page: number, size: number) => {
        if (this.state.selectedDelegate) {
            this.setState({ loadingDelegateCommandsData: true, delegateCommandData: undefined, sizeDelegate: size });
            var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(page, size, this.state.selectedDateDelegate, this.state.selectedDelegate!.id!);
            this.setState({
                delegatePage: page,
                delegateCommands: commands,
                totalDelegate: total,
                loadingDelegateCommandsData: false,
                sizeDelegate: size,
            });
        }
        this.setState({
            delegatePage: page,
            loadingDelegateCommandsData: false,
            sizeDelegate: size,
        });
    }

    handleKamPageChange = async (page: number, size: number) => {
        if (this.state.selectedKam) {
            this.setState({ loadingKamCommandsData: true, kamCommandData: undefined, sizeKam: size });
            var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(page, size, this.state.selectedDateKam, this.state.selectedKam!.id!);
            this.setState({
                kamPage: page,
                kamCommands: commands,
                totalKam: total,
                loadingKamCommandsData: false,
                sizeKam: size,
            });
        }
        this.setState({
            kamPage: page,
            loadingKamCommandsData: false,
            sizeKam: size,
        });
    }


    handleDelegateRowNumChange = async (size: number) => {
        this.setState({ loadingDelegateCommandsData: true, delegatePage: 1, sizeDelegate: size, delegateCommandData: undefined });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, size, this.state.selectedDateDelegate, this.state.selectedDelegate!.id!);

        this.setState({
            delegatePage: 1,
            sizeDelegate: size,
            delegateCommands: commands,
            totalDelegate: total,
            loadingDelegateCommandsData: false,
        });
    }

    handleKamRowNumChange = async (size: number) => {
        this.setState({ loadingKamCommandsData: true, kamPage: 1, sizeKam: size, kamCommandData: undefined });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfDelegate(1, size, this.state.selectedDateKam, this.state.selectedKam!.id!);

        this.setState({
            kamPage: 1,
            sizeKam: size,
            kamCommands: commands,
            totalKam: total,
            loadingKamCommandsData: false,
        });
    }

    handleShowSuppliersDialog = async (index: number) => {

        this.setState({
            commandIndex: index,
            showSuppliersDialog: true,
        });
    }

    exportToExcel = (data: any[], fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };


    handleExportExcelData = async () => {
        this.setState({ loadingExcelData: true });
        var { commands: commands, total: total } = await this.commandService.getAllCommandsOfYear(this.state.selectedDelegate!.id!);
        let clientsSet = new Set<number>();
        let productsSet = new Set<number>();
        commands.forEach((c) => {
            if (c.visit?.client && c.isHonored) {
                clientsSet.add(c.visit.client.id!);
                c.products?.forEach((p) => {
                    productsSet.add(p.id!);
                });
            }
        });

        let clients = Array.from(clientsSet).map((clientId) => {
            return commands.find((c) => c.visit!.client!.id! === clientId)!.visit!.client;
        });
        let products = Array.from(productsSet).map((productId) => {
            return commands.find((c) => c.products!.some((p) => p.id === productId))!.products!.find((p) => p.id === productId);
        });
        let filteredCommands: any[] = clients.map((c) => {
            let coms = commands.filter((com) => com.visit?.client?.id === c!.id);
            let dates = coms.map((com) => com.visit?.createdDate);
            let obj: any = {
                client: c!.name,
                wilaya: c!.wilaya,
                commune: c!.commune,
                commandsNum: coms.length,
                dates: dates,
            };
            products.forEach((p) => {
                let quantities: number[] = [];
                dates.forEach((d) => {
                    quantities.push(coms.find((com) => com.visit?.createdDate === d)?.products?.find((pro) => pro.id === p?.id)?.quantity ?? 0);
                });
                obj[`${p!.name}`] = quantities;

            });

            return obj;
        });

        const alphabet = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const workbook = XLSX.utils.book_new();
        const sheetName = 'Sheet1';
        const worksheet = XLSX.utils.aoa_to_sheet([[]]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        let index = 2;
        let proLen = 0;
        XLSX.utils.sheet_add_aoa(worksheet, [["Client"]], { origin: 'A1' });
        XLSX.utils.sheet_add_aoa(worksheet, [["Wilaya"]], { origin: 'B1' });
        XLSX.utils.sheet_add_aoa(worksheet, [["Commune"]], { origin: 'C1' });
        XLSX.utils.sheet_add_aoa(worksheet, [["Nombre de commandes"]], { origin: 'D1' });
        XLSX.utils.sheet_add_aoa(worksheet, [["Dates"]], { origin: 'E1' });
        while (index - 2 < filteredCommands.length) {
            XLSX.utils.sheet_add_aoa(worksheet, [[filteredCommands[index - 2].client ?? '']], { origin: `A${index + proLen}` });
            XLSX.utils.sheet_add_aoa(worksheet, [[filteredCommands[index - 2].wilaya ?? '']], { origin: `B${index + proLen}` });
            XLSX.utils.sheet_add_aoa(worksheet, [[filteredCommands[index - 2].commune ?? '']], { origin: `C${index + proLen}` });
            XLSX.utils.sheet_add_aoa(worksheet, [[filteredCommands[index - 2].commandsNum ?? '']], { origin: `D${index + proLen}` });
            const { client, wilaya, commune, commandsNum, dates, ...others } = filteredCommands[index - 2];
            let j = 0;
            for (let key in others) {
                XLSX.utils.sheet_add_aoa(worksheet, [[key]], { origin: `${alphabet[j]}1` });
                j++;
            }
            for (let i = 1; i <= filteredCommands[index - 2]!.dates!.length; i++) {
                XLSX.utils.sheet_add_aoa(worksheet, [[formatDateToYYYYMMDD(filteredCommands[index - 2]!.dates[i - 1])]], { origin: `E${index + i + proLen - 1}` });
                let k = 0;
                for (let key in others) {
                    XLSX.utils.sheet_add_aoa(worksheet, [[others[key][i - 1]]], { origin: `${alphabet[k]}${index + i + proLen - 1}` });
                    k++;
                }
            }
            proLen += filteredCommands[index - 2]!.dates!.length;
            index++
        }

        XLSX.writeFile(workbook, `Données_excel_des_commandes_${this.state.selectedDelegate?.username}.xlsx`);
        this.setState({ loadingExcelData: false });

    };


    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadCommandPageData();
        }
    }

    render() {
        if (this.state.isLoading) {
            this.loadCommandPageData();
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
                                    this.state.currentUser.type !== UserType.supervisor ? (<Tab label="Kam" />) : null
                                }

                            </Tabs>
                        </Box>
                    </Box>
                    <CustomTabPanel value={this.state.index} index={0} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>
                                {this.state.currentUser.type !== UserType.supervisor ?
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
                                <MonthYearPicker initialDate={this.state.selectedDateDelegate} onPick={this.handleOnPickDateDelegate}></MonthYearPicker >
                                {
                                    this.state.currentUser.type !== UserType.operator ?
                                        (<div style={{
                                            height: '50px',
                                            width: '150px',
                                            marginLeft: '8px',
                                            display: 'flex'
                                        }}>
                                            <Button variant="contained"
                                                disabled={this.state.selectedDelegate === undefined || this.state.loadingExcelData}
                                                sx={{ margin: '0px', height: '40px', }}
                                                onClick={this.handleExportExcelData}
                                            >
                                                <StorageIcon />
                                            </Button>
                                            <div style={{
                                                marginLeft: '8px',
                                                display: this.state.loadingExcelData ? "block" : 'none'
                                            }}>

                                                <DotSpinner
                                                    size={40}
                                                    speed={0.9}
                                                    color="black"
                                                />
                                            </div>
                                        </div>) : null
                                }
                            </div>
                            <div style={{
                                width: '100%',
                                flexGrow: '1',
                                display: 'flex',
                                height: 'calc(100% - 60px)'
                            }}>
                                <CompoundBox
                                    direction={RenderDirection.horizontal}
                                    flexes={[70, 30]}
                                >
                                    <CommandDelegateTable
                                        id='command-delegate-table'
                                        total={this.state.totalDelegate}
                                        page={this.state.delegatePage}
                                        size={this.state.sizeDelegate}
                                        suppliers={this.state.suppliers}
                                        pageChange={this.handleDelegatePageChange}
                                        data={this.state.delegateCommands}
                                        isLoading={this.state.loadingDelegateCommandsData}
                                        displayCommand={this.handleDisplayDelegateCommand}
                                        onHonor={this.handleHonorDelegateCommand}
                                    ></CommandDelegateTable>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                        {
                                            this.state.loadingDelegateCommandData ?
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
                                                    <CommandPanel command={this.state.delegateCommandData} ></CommandPanel>
                                                )
                                        }
                                    </div>
                                </CompoundBox>
                            </div>
                            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.state.showDialog} autoHideDuration={3000} onClose={this.handleCloseDialog} message={this.state.dialogMessage} />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={this.state.index} index={1} >
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>
                                <div style={{ height: '50px', width: '150px', margin: '0px 8px' }}>
                                    <UserDropdown
                                        users={this.state.kams}
                                        selectedUser={this.state.selectedKam}
                                        onSelectUser={this.handleSelectKam}
                                        label='Kam'
                                    />
                                </div>
                                <MonthYearPicker initialDate={this.state.selectedDateKam} onPick={this.handleOnPickDateKam}></MonthYearPicker >
                            </div>
                            <div style={{
                                width: '100%',
                                flexGrow: '1',
                                display: 'flex',
                                height: 'calc(100% - 60px)'
                            }} key={0}>
                                <CompoundBox
                                    direction={RenderDirection.horizontal}
                                    flexes={[70, 30]}
                                >
                                    <CommandCamTable
                                        id='command-cam-table'
                                        total={this.state.totalKam}
                                        page={this.state.kamPage}
                                        size={this.state.sizeKam}
                                        suppliers={this.state.suppliers}
                                        pageChange={this.handleKamPageChange}
                                        data={this.state.kamCommands}
                                        onHonor={this.handleHonorKamCommand}
                                        isLoading={this.state.loadingKamCommandsData}
                                        displayCommand={this.handleDisplayKamCommand}
                                    ></CommandCamTable>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                        {
                                            this.state.loadingKamCommandData ?
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
                                                    <CommandPanel command={this.state.kamCommandData} ></CommandPanel>
                                                )
                                        }
                                    </div>
                                </CompoundBox>
                            </div>
                            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.state.showDialog} autoHideDuration={3000} onClose={this.handleCloseDialog} message={this.state.dialogMessage} />
                        </div>
                    </CustomTabPanel>

                </div>

            );
        }
    }
}

export default CommandPage;


