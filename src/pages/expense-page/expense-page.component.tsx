import React, { Component } from 'react';
import '../expense-page/expense-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import ExpenseTable from '../../components/expense-table/expense-table.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/esm/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserService from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';
import ExpenseModel from '../../models/expense.model';
import ExpenseService from '../../services/expense.service';
import { DotSpinner } from '@uiball/loaders';
import ExpenseUserModel from '../../models/expense-user.model';
import { Button as MuiButton } from '@mui/material';
import ProofsDialog from '../../components/proofs-dialog/proofs-dialog.component';
import ExpenseStatsDialog from '../../components/expense-stats-dialog/expense-stats-dialog.component';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserDropdown from '../../components/user-dropdown/user-dropdown';



interface ExpensePageProps {
    selectedDate: Date;
    isLoading: boolean;
    proofsDialogIsOpen: boolean;
    expenseStatsDialogIsOpen: boolean;
    loadingDelegates: boolean;
    index: number;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    kams: UserModel[];
    selectedDelegate?: UserModel;
    selectedKam?: UserModel;
    selectedSupervisor?: UserModel;
    loadingExpensesData: boolean;
    delegteExpenses: ExpenseModel[];
    delegteExpensesUser: ExpenseUserModel;
    kamExpenses: ExpenseModel[];
    kamExpensesUser: ExpenseUserModel;
    currentUser: UserModel;
}


class ExpensePage extends Component<{}, ExpensePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            loadingDelegates: false,
            searchText: '',
            delegates: [],
            supervisors: [],
            kams: [],
            loadingExpensesData: false,
            proofsDialogIsOpen: false,
            expenseStatsDialogIsOpen: false,
            delegteExpenses: [],
            delegteExpensesUser: new ExpenseUserModel({}),
            kamExpenses: [],
            kamExpensesUser: new ExpenseUserModel({}),
            index: 0,
        }
    }

    userService = new UserService();
    expenseService = new ExpenseService();


    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingExpensesData: true, });
        var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(this.state.selectedDate, delegate.id!);
        var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, delegteExpenses: delegteExpenses, loadingExpensesData: false, delegteExpensesUser: delegteExpensesUser });
    }

    handleSelectKam = async (kam: UserModel) => {
        this.setState({ loadingExpensesData: true, });
        var kamExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(this.state.selectedDate, kam.id!);
        var kamExpensesUser = await this.expenseService.getExpensesUserByDateMoth(this.state.selectedDate, kam.id!);
        this.setState({ selectedKam: kam, kamExpenses: kamExpenses, loadingExpensesData: false, kamExpensesUser: kamExpensesUser });
    }

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({
            delegates: [],
            delegteExpenses: [],
            loadingDelegates: true,
        });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);

        this.setState({
            delegates: delegates,
            loadingDelegates: false,
        });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingExpensesData: true, });
        if (this.state.selectedDelegate) {
            var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(date, this.state.selectedDelegate!.id!);
            var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(date, this.state.selectedDelegate!.id!);
            this.setState({
                delegteExpenses: delegteExpenses,
                delegteExpensesUser: delegteExpensesUser
            });
        }
        if (this.state.selectedKam) {
            var kamExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(date, this.state.selectedKam!.id!);
            var kamExpensesUser = await this.expenseService.getExpensesUserByDateMoth(date, this.state.selectedKam!.id!);
            this.setState({
               
                kamExpenses: kamExpenses,
                kamExpensesUser: kamExpensesUser,
            });
        }

        this.setState({
            selectedDate: date,
            loadingExpensesData: false,
        });
    }

    handleValidateExpensesUser = async () => {
        if (this.state.delegteExpensesUser?.id) {
            await this.expenseService.validateExpensesUser(this.state.delegteExpensesUser!.id!);
        }
    }

    loadExpensePageData = async () => {
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
            this.setState({ supervisors: supervisors, kams: kams, isLoading: false, });
        }
    }

    handleCloseProofsDialog = () => {
        this.setState({ proofsDialogIsOpen: false });
    }

    handleCloseExpenseStatsDialog = () => {
        this.setState({ expenseStatsDialogIsOpen: false });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {
            this.loadExpensePageData();
        }
    }

    render() {
        if (this.state.isLoading) {
            this.loadExpensePageData();
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
                                    this.state.currentUser.type === UserType.admin ? (<Tab label="Kams" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', width: '100%' }} value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', width: '100%', }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>
                                    {this.state.currentUser.type === UserType.admin ?
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
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexGrow: '1',
                                    marginBottom: '16px',
                                    height: 'calc(100% - 170px)'
                                }} >
                                    <ExpenseTable data={this.state.delegteExpenses} isLoading={this.state.loadingExpensesData}></ExpenseTable>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '8px' }}>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        état: {!this.state.delegteExpensesUser.userValidation && !this.state.delegteExpensesUser.userValidation ? 'En attente' :
                                            this.state.delegteExpensesUser.userValidation && !this.state.delegteExpensesUser.userValidation ? 'Envoyée' : 'Approuvée'
                                        }
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total Km : {this.state.delegteExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total nuitées :  {this.state.delegteExpenses.map((e) => e.nightsTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total autre frais : {this.state?.delegteExpenses.map((e) => e.otherExpenses || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total note de frais : {this.state?.delegteExpensesUser?.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ expenseStatsDialogIsOpen: true });
                                    }}>
                                        Ouvrir statistiques manuelles
                                    </MuiButton>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ proofsDialogIsOpen: true });
                                    }}>
                                        Consulter piece jointes
                                    </MuiButton>
                                    <MuiButton disabled={!this.state.delegteExpensesUser.userValidation && !this.state.delegteExpensesUser.userValidation} variant="contained" disableElevation sx={{ marginBottom: '16px' }} onClick={this.handleValidateExpensesUser}>
                                        Valider la note de frais
                                    </MuiButton>
                                </div>
                                <ProofsDialog data={this.state.delegteExpenses.map<{ date: Date, urls: string[] }>((ex) => {
                                    var link: { date: Date, urls: string[] } = { date: ex.createdDate!, urls: ex.proofs!.map(p => p.url ?? '') };
                                    return link;
                                })} isOpen={this.state.proofsDialogIsOpen} onClose={this.handleCloseProofsDialog} ></ProofsDialog>
                                <ExpenseStatsDialog userId={this.state.selectedDelegate?.id} isOpen={this.state.expenseStatsDialogIsOpen} onClose={this.handleCloseExpenseStatsDialog} ></ExpenseStatsDialog>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', width: '100%' }} value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', width: '100%', }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>
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
                                <div style={{
                                    width: '100%',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    flexGrow: '1',
                                    height: 'calc(100% - 170px)'
                                }} >
                                    <ExpenseTable data={this.state.kamExpenses} isLoading={this.state.loadingExpensesData}></ExpenseTable>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '8px' }}>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        état: {!this.state.kamExpensesUser.userValidation && !this.state.kamExpensesUser.userValidation ? 'En attente' :
                                            this.state.kamExpensesUser.userValidation && !this.state.kamExpensesUser.userValidation ? 'Envoyée' : 'Approuvée'
                                        }
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total Km : {this.state.kamExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total nuitées :  {this.state.kamExpenses.map((e) => e.nightsTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total autre frais : {this.state?.kamExpenses.map((e) => e.otherExpenses || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total note de frais : {this.state?.kamExpensesUser?.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ expenseStatsDialogIsOpen: true });
                                    }}>
                                        Ouvrir statistiques manuelles
                                    </MuiButton>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ proofsDialogIsOpen: true });
                                    }}>
                                        Consulter piece jointes
                                    </MuiButton>
                                    <MuiButton disabled={!this.state.kamExpensesUser.userValidation && !this.state.kamExpensesUser.userValidation} variant="contained" disableElevation sx={{ marginBottom: '16px' }} onClick={this.handleValidateExpensesUser}>
                                        Valider la note de frais
                                    </MuiButton>
                                </div>
                                <ProofsDialog data={this.state.kamExpenses.map<{ date: Date, urls: string[] }>((ex) => {
                                    var link: { date: Date, urls: string[] } = { date: ex.createdDate!, urls: ex.proofs!.map(p => p.url ?? '') };
                                    return link;
                                })} isOpen={this.state.proofsDialogIsOpen} onClose={this.handleCloseProofsDialog} ></ProofsDialog>
                                <ExpenseStatsDialog userId={this.state.selectedKam?.id} isOpen={this.state.expenseStatsDialogIsOpen} onClose={this.handleCloseExpenseStatsDialog} ></ExpenseStatsDialog>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            );
        }
    }
}

export default ExpensePage;
