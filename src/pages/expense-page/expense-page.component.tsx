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
import UserModel from '../../models/user.model';
import ExpenseModel from '../../models/expense.model';
import ExpenseService from '../../services/expense.service';
import { DotSpinner } from '@uiball/loaders';
import ExpenseUserModel from '../../models/expense-user.model';
import { Button as MuiButton } from '@mui/material';



interface ExpensePageProps {
    selectedDate: Date;
    isLoading: boolean;
    hasData: boolean;
    searchText: string;
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    loadingExpensesData: boolean;
    expenses: ExpenseModel[];
    expensesUser: ExpenseUserModel;
}


class ExpensePage extends Component<{}, ExpensePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            isLoading: false,
            hasData: false,
            searchText: '',
            delegates: [],
            filtredDelegates: [],
            loadingExpensesData: false,
            expenses: [],
            expensesUser: new ExpenseUserModel({}),
        }
    }

    userService = new UserService();
    expenseService = new ExpenseService();

    handleDelegateFilter = () => {
        if (this.state.searchText.length === 0) {
            var filtredDelegates = [...this.state.delegates];
            this.setState({ filtredDelegates: filtredDelegates });
        }
        else {
            var filtredDelegates = this.state.delegates.filter(delegate => delegate.username!.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filtredDelegates: filtredDelegates });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    handleSelectDelegate = async (delegate: UserModel) => {
        this.setState({ loadingExpensesData: true, });
        var expenses = await this.expenseService.getAllExpensesOfUserByDateMoth(this.state.selectedDate, delegate.id!);
        var expensesUser = await this.expenseService.getExpensesUserByDateMoth(this.state.selectedDate, delegate.id!);
        this.setState({ selectedDelegate: delegate, expenses: expenses, loadingExpensesData: false, expensesUser: expensesUser });
    }

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingExpensesData: true, });
        var expenses = await this.expenseService.getAllExpensesOfUserByDateMoth(date, this.state.selectedDelegate!.id!);
        var expensesUser = await this.expenseService.getExpensesUserByDateMoth(date, this.state.selectedDelegate!.id!);
        this.setState({ selectedDate: date, expenses: expenses, loadingExpensesData: false, expensesUser: expensesUser });
    }

    handleValidateExpensesUser = async () => {
        if (this.state.expensesUser?.id) {
            await this.expenseService.validateExpensesUser(this.state.expensesUser!.id!);
        }

    }

    loadExpensePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var delegates = await this.userService.getDelegateUsers();
            if (delegates.length > 0) {
                this.setState({ selectedDelegate: delegates[0] });
            }
            this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true });
        }
    }

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
                <div className='expense-container'>
                    <div className='search-bar'>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                            </Form.Group>
                        </Form>
                        <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1' }} >
                        <ExpenseTable data={this.state.expenses} isLoading={this.state.loadingExpensesData}></ExpenseTable>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <h6 style={{ fontSize: '20px', marginRight: '16px' }}>
                            Total : {this.state?.expensesUser?.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                        </h6>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <MuiButton variant="outlined" disableElevation sx={{ marginRight: '16px', marginBottom: '16px' }}>
                            Consulter piece jointes
                        </MuiButton>

                        <MuiButton variant="contained" disableElevation sx={{ marginBottom: '16px' }} onClick={this.handleValidateExpensesUser}>
                            Valider la note de frais
                        </MuiButton>
                    </div>
                </div>
            );
        }
    }
}

export default ExpensePage;
