import React, { Component } from 'react';
import '../expense-page/expense-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import ExpenseTable from '../../components/expense-table/expense-table.component';
import Button from 'react-bootstrap/Button';
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
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';



interface ExpensePageProps {
    selectedDate: Date;
    isLoading: boolean;
    proofsDialogIsOpen: boolean;
    hasData: boolean;
    index: number;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    kams: UserModel[];
    filteredKams: UserModel[];
    filteredDelegates: UserModel[];
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
    constructor({}) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: false,
            hasData: false,
            searchText: '',
            delegates: [],
            supervisors: [],
            kams: [],
            filteredKams: [],
            filteredDelegates: [],
            loadingExpensesData: false,
            proofsDialogIsOpen: false,
            delegteExpenses: [],
            delegteExpensesUser: new ExpenseUserModel({}),
            kamExpenses: [],
            kamExpensesUser: new ExpenseUserModel({}),
            index: 0,
        }
    }

    userService = new UserService();
    expenseService = new ExpenseService();

    handleDelegateFilter = () => {
        if (this.state.searchText.length === 0) {
            var filteredDelegates = [...this.state.delegates];
            this.setState({ filteredDelegates: filteredDelegates });
        }
        else {
            var filteredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filteredDelegates: filteredDelegates });
        }
    }
    handleKamFilter = () => {
        if (this.state.searchText.length === 0) {
            var filteredKams = [...this.state.kams];
            this.setState({ filteredKams: filteredKams });
        }
        else {
            var filteredKams = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filteredKams: filteredKams });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

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
        this.setState({ loadingExpensesData: true, delegates: [] });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        if (delegates.length > 0) {
            this.setState({ selectedDelegate: delegates[0], selectedSupervisor: supervisor });
            var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(this.state.selectedDate, delegates[0].id!);
            var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(this.state.selectedDate, delegates[0].id!);
            this.setState({ delegteExpenses: delegteExpenses, delegteExpensesUser: delegteExpensesUser });
        }
        else {
            this.setState({ delegteExpenses: [], });
        }
        this.setState({ loadingExpensesData: false, });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingExpensesData: true, });
        var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(date, this.state.selectedDelegate!.id!);
        var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(date, this.state.selectedDelegate!.id!);
        var kamExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(date, this.state.selectedKam!.id!);
        var kamExpensesUser = await this.expenseService.getExpensesUserByDateMoth(date, this.state.selectedKam!.id!);
        this.setState({ selectedDate: date,kamExpenses:kamExpenses,kamExpensesUser:kamExpensesUser, delegteExpenses: delegteExpenses, loadingExpensesData: false, delegteExpensesUser: delegteExpensesUser });
    }

    handleValidateExpensesUser = async () => {
        if (this.state.delegteExpensesUser?.id) {
            await this.expenseService.validateExpensesUser(this.state.delegteExpensesUser!.id!);
        }
    }

    loadExpensePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var currentUser = await this.userService.getMe();

            if (currentUser != undefined) {
                this.setState({ currentUser: currentUser });
            }

            if (currentUser.type === UserType.supervisor) {
                var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);
                if (delegates.length > 0) {
                    this.setState({ selectedDelegate: delegates[0] });
                    var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(new Date(), delegates[0].id!);
                    var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(new Date(), delegates[0].id!);
                    this.setState({ delegteExpenses: delegteExpenses, delegteExpensesUser: delegteExpensesUser });
                }
                this.setState({ isLoading: false, delegates: delegates, filteredDelegates: delegates, hasData: true });
            } else {
                var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
                var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);
                this.setState({ supervisors: supervisors, kams: kams,filteredKams:kams });
                if (kams.length > 0) {
                    this.setState({ selectedKam: kams[0], });
                    var kamExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(new Date(), kams[0].id!);
                    var kamExpensesUser = await this.expenseService.getExpensesUserByDateMoth(new Date(), kams[0].id!);
                    this.setState({ kamExpenses: kamExpenses, kamExpensesUser: kamExpensesUser });
                }
                if (supervisors.length > 0) {
                    var delegates = await this.userService.getUsersByCreator(supervisors[0].id!, UserType.delegate);
                    if (delegates.length > 0) {
                        this.setState({ selectedDelegate: delegates[0], selectedSupervisor: supervisors[0] });
                        var delegteExpenses = await this.expenseService.getAllExpensesOfUserByDateMoth(new Date(), delegates[0].id!);
                        var delegteExpensesUser = await this.expenseService.getExpensesUserByDateMoth(new Date(), delegates[0].id!);
                        this.setState({ delegteExpenses: delegteExpenses, delegteExpensesUser: delegteExpensesUser });
                    }
                    this.setState({ isLoading: false, delegates: delegates, filteredDelegates: delegates, hasData: true });
                }
            }
        }
    }

    handleCloseProofsDialog = () => {
        this.setState({ proofsDialogIsOpen: false });
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, });
    };

    render() {
        if (!this.state.hasData) {
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
                                {
                                    this.state.currentUser.type === UserType.admin ? (<div style={{ display: 'flex', height: '55px' }}>
                                        <UserPicker delegates={this.state.supervisors} onSelect={this.handleSelectSupervisor}></UserPicker>
                                    </div>) : null
                                }
                                <div style={{ display: 'flex', height: '55px' }}>
                                    <UserPicker delegates={this.state.filteredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                                </div>
                                <div style={{ width: '100%', marginTop: '5px', display: 'flex', flexGrow: '1', height: this.state.currentUser.type === UserType.admin ? 'calc(100% - 240px)' : 'calc(100% - 180px)' }} >
                                    <ExpenseTable data={this.state.delegteExpenses} isLoading={this.state.loadingExpensesData}></ExpenseTable>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total Km : {this.state.delegteExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total nuitées :  {this.state.delegteExpenses.map((e) => e.nightsTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total autre frais : {this.state?.delegteExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total note de frais : {this.state?.delegteExpensesUser?.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ proofsDialogIsOpen: true });
                                    }}>
                                        Consulter piece jointes
                                    </MuiButton>
                                    <MuiButton variant="contained" disableElevation sx={{ marginBottom: '16px' }} onClick={this.handleValidateExpensesUser}>
                                        Valider la note de frais
                                    </MuiButton>
                                </div>
                                <ProofsDialog data={this.state.delegteExpenses.map<{ date: Date, urls: string[] }>((ex) => {
                                    var link: { date: Date, urls: string[] } = { date: ex.createdDate!, urls: ex.proofs!.map(p => p.url ?? '') };
                                    return link;
                                })} isOpen={this.state.proofsDialogIsOpen} onClose={this.handleCloseProofsDialog} ></ProofsDialog>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', height: 'calc(100% - 50px)', width: '100%' }} value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100% - 40px)', width: '100%', }}>
                                <div className='search-bar'>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleKamFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>
                                    <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                                </div>
                                <div style={{ display: 'flex', height: '55px' }}>
                                    <UserPicker delegates={this.state.filteredKams} onSelect={this.handleSelectKam}></UserPicker>
                                </div>
                                <div style={{ width: '100%', marginTop: '5px', display: 'flex', flexGrow: '1', height: this.state.currentUser.type === UserType.admin ? 'calc(100% - 240px)' : 'calc(100% - 180px)' }} >
                                    <ExpenseTable data={this.state.kamExpenses} isLoading={this.state.loadingExpensesData}></ExpenseTable>
                                </div>
                                <div style={{ display: 'flex', justifyContent:'space-evenly' }}>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total Km : {this.state.kamExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total nuitées :  {this.state.kamExpenses.map((e) => e.nightsTotal || 0).reduce((sum, current) => sum + current, 0)}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total autre frais : {this.state?.kamExpenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                    <h6 style={{ fontSize: '16px', marginRight: '16px' }}>
                                        Total note de frais : {this.state?.kamExpensesUser?.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                                    </h6>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }} onClick={() => {
                                        this.setState({ proofsDialogIsOpen: true });
                                    }}>
                                        Consulter piece jointes
                                    </MuiButton>
                                    <MuiButton variant="contained" disableElevation sx={{ marginBottom: '16px' }} onClick={this.handleValidateExpensesUser}>
                                        Valider la note de frais
                                    </MuiButton>
                                </div>
                                <ProofsDialog data={this.state.kamExpenses.map<{ date: Date, urls: string[] }>((ex) => {
                                    var link: { date: Date, urls: string[] } = { date: ex.createdDate!, urls: ex.proofs!.map(p => p.url ?? '') };
                                    return link;
                                })} isOpen={this.state.proofsDialogIsOpen} onClose={this.handleCloseProofsDialog} ></ProofsDialog>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            );
        }
    }
}

export default ExpensePage;
