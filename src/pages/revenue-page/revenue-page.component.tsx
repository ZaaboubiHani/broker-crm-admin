
import { Component } from 'react';
import '../revenue-page/revenue-page.style.css';
import { DotSpinner } from '@uiball/loaders';
import UserService from '../../services/user.service';
import RevenueService from '../../services/revenue.service';
import RevenueModel from '../../models/revenue.model';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import RevenueTable from '../../components/revenue-table/revenue-table.component';
import StatisticsService from '../../services/statics.service';
import RevenuePanel from '../../components/revenue-panel/revenue-panel.component';
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';
import UserModel, { UserType } from '../../models/user.model';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import CompoundBox, { RenderDirection } from '../../components/compound-box/compound-box.component';

interface RevenuePageProps {
    currentUser: UserModel;
    selectedDate: Date;
    isLoading: boolean;
    searchText: string;
    loadingRevenuesData: boolean;
    loadingRevenueData: boolean;
    revenues: RevenueModel[];
    filteredRevenues: RevenueModel[];
    totalTeamRevenue: number;
    totalTeamRevenueHonored: number;
    supervisors: UserModel[];
    selectedSupervisor?: UserModel;
    totalTeamRevenueNotHonored: number;
    delegateWilayasRevenue: { wilaya: string, total: number, percentage: number }[];
    delegateProductsRevenue: { product: string, quantity: number, total: number, percentage: number }[];
    totalDelegateRevenue: number;
    totalDelegateRevenueHonored: number;
    totalDelegateRevenueNotHonored: number;
    showDetails: boolean;
}

class RevenuePage extends Component<{}, RevenuePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            searchText: '',
            revenues: [],
            filteredRevenues: [],
            loadingRevenuesData: false,
            loadingRevenueData: false,
            totalTeamRevenue: 0,
            totalTeamRevenueHonored: 0,
            totalTeamRevenueNotHonored: 0,
            totalDelegateRevenue: 0,
            totalDelegateRevenueHonored: 0,
            totalDelegateRevenueNotHonored: 0,
            delegateProductsRevenue: [],
            delegateWilayasRevenue: [],
            showDetails: false,
            supervisors: [],
        }
    }

    userService = UserService.getInstance();
    revenueService = RevenueService.getInstance();
    statisticsService = StatisticsService.getInstance();

    handleDisplayDetails = async (userId: number) => {
        this.setState({ loadingRevenueData: true });
        var delegateWilayasRevenue = await this.statisticsService.getUserWilayasRevenue(this.state.selectedDate, userId);
        var delegateProductsRevenue = await this.statisticsService.getUserProductsRevenue(this.state.selectedDate, userId);
        var totalDelegateRevenue = await this.statisticsService.getTotalUserRevenue(this.state.selectedDate, userId);
        var totalDelegateRevenueHonored = await this.statisticsService.getTotalUserRevenue(this.state.selectedDate, userId, true);
        var totalDelegateRevenueNotHonored = await this.statisticsService.getTotalUserRevenue(this.state.selectedDate, userId, false);
        this.setState({
            loadingRevenueData: false, totalDelegateRevenue: totalDelegateRevenue, totalDelegateRevenueHonored: totalDelegateRevenueHonored, totalDelegateRevenueNotHonored: totalDelegateRevenueNotHonored,
            delegateWilayasRevenue: delegateWilayasRevenue, delegateProductsRevenue: delegateProductsRevenue,
            showDetails: true,
        });
    };

    loadRevenuePageData = async () => {
        var currentUser = await this.userService.getMe();

        this.setState({ currentUser: currentUser });

        if (currentUser.type === UserType.supervisor) {
            var revenues = await this.revenueService.getAllRevenuesMonth(new Date(), currentUser.id!);
            var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(new Date(), currentUser.id!);
            var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(new Date(), currentUser.id!, true);
            var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(new Date(), currentUser.id!, false);
            this.setState({
                revenues: revenues,
                filteredRevenues: revenues,
                totalTeamRevenue: totalTeamRevenue,
                totalTeamRevenueHonored: totalTeamRevenueHonored,
                totalTeamRevenueNotHonored: totalTeamRevenueNotHonored,
                isLoading: false,
            });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            this.setState({
                supervisors: supervisors,
                isLoading: false,
            });
        }


    };

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingRevenuesData: true, showDetails: false });
        if (this.state.currentUser.type === UserType.supervisor) {
            var revenues = await this.revenueService.getAllRevenuesMonth(date, this.state.currentUser.id!);
            var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(date, this.state.currentUser.id!);
            var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(date, this.state.currentUser.id!, true);
            var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(date, this.state.currentUser.id!, false);
            this.setState({
                selectedDate: date,
                revenues: revenues,
                loadingRevenuesData: false,
                filteredRevenues: revenues,
                totalTeamRevenue: totalTeamRevenue,
                totalTeamRevenueHonored: totalTeamRevenueHonored,
                totalTeamRevenueNotHonored: totalTeamRevenueNotHonored
            });
        } else {
            if (this.state.selectedSupervisor) {
                var revenues = await this.revenueService.getAllRevenuesMonth(date, this.state.selectedSupervisor.id!);
                var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(date, this.state.selectedSupervisor.id!);
                var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(date, this.state.selectedSupervisor.id!, true);
                var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(date, this.state.selectedSupervisor.id!, false);
                this.setState({
                    selectedDate: date,
                    revenues: revenues,
                    loadingRevenuesData: false,
                    totalTeamRevenue: totalTeamRevenue,
                    filteredRevenues: revenues,
                    totalTeamRevenueHonored: totalTeamRevenueHonored,
                    totalTeamRevenueNotHonored: totalTeamRevenueNotHonored
                });
            }
            this.setState({
                loadingRevenuesData: false,
            });
        }
    }

    handleRevenuesFilter = () => {
        this.setState({ showDetails: false });
        if (this.state.searchText.length === 0) {
            var filteredRevenues = [...this.state.revenues];
            this.setState({ filteredRevenues: filteredRevenues });
        }
        else {
            var filteredRevenues = this.state.revenues.filter(revenue => revenue?.delegateName?.toLowerCase().includes(this.state.searchText.toLowerCase()));
            this.setState({ filteredRevenues: filteredRevenues });
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value });
    }

    handleSelectSupervisor = async (supervisor?: UserModel) => {
        this.setState({ selectedSupervisor: supervisor, loadingRevenuesData: true, showDetails: false });
        var revenues = await this.revenueService.getAllRevenuesMonth(this.state.selectedDate, supervisor!.id!);
        var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(this.state.selectedDate, supervisor!.id!);
        var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(this.state.selectedDate, supervisor!.id!, true);
        var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(this.state.selectedDate, supervisor!.id!, false);
        this.setState({
            revenues: revenues,
            loadingRevenuesData: false,
            filteredRevenues: revenues,
            totalTeamRevenue: totalTeamRevenue,
            totalTeamRevenueHonored: totalTeamRevenueHonored,
            totalTeamRevenueNotHonored: totalTeamRevenueNotHonored
        });
    }


    componentDidMount() {
        if (localStorage.getItem('isLogged') === 'true') {

            this.loadRevenuePageData();
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
                <div className='revenue-container' style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch', backgroundColor: '#eee' }}>
                    <div style={{ display: 'flex', height: '40px', margin: '8px 0px 8px 8px' }}>

                        {
                            this.state.currentUser.type === UserType.admin ? (
                                <div style={{ margin: '0px 8px' }}>
                                    <UserDropdown
                                        users={this.state.supervisors}
                                        selectedUser={this.state.selectedSupervisor}
                                        onSelectUser={this.handleSelectSupervisor}
                                        label='Superviseur'
                                    />
                                </div>

                            ) : null
                        }
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >

                    </div>
                    <div style={{ margin: '0px 8px 0px 16px', display: 'flex', justifyContent: 'space-between', padding: '4px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <CircularProgressLabel
                            colorStroke='#FC761E'
                            direction='row'
                            secondTitle="Total chiffre d'affaire d'equipe:"
                            firstTitle={this.state.totalTeamRevenue?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                            value={100} />
                        <CircularProgressLabel
                            colorStroke='#CC38E0'
                            direction='row'
                            secondTitle='Total honore:'
                            firstTitle={this.state.totalTeamRevenueHonored?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                            value={this.state.totalTeamRevenue !== 0 ? this.state.totalTeamRevenueHonored / this.state.totalTeamRevenue * 100 : 0} />
                        <CircularProgressLabel
                            colorStroke='#38EB5D'
                            direction='row'
                            secondTitle="Total non honore:"
                            firstTitle={this.state.totalTeamRevenueNotHonored?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                            value={this.state.totalTeamRevenue !== 0 ? this.state.totalTeamRevenueNotHonored / this.state.totalTeamRevenue * 100 : 0} />
                    </div>
                    <div style={{ flex: '1', display: 'flex', flexGrow: '1', height: 'calc(100% - 500px)', margin: '8px' }}>
                        <CompoundBox
                            direction={RenderDirection.horizontal}
                            flexes={[70, 30]}
                        >
                            <RevenueTable
                                data={this.state.filteredRevenues}
                                isLoading={this.state.loadingRevenuesData}
                                displayDetails={this.handleDisplayDetails}></RevenueTable>

                            <div style={{
                                width: '100%',
                                height: '100%',
                                margin: '0px',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: '8px'
                            }}>
                                {
                                    this.state.loadingRevenueData ?
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
                                            <RevenuePanel
                                                showData={this.state.showDetails}
                                                total={this.state.totalDelegateRevenue}
                                                totalHonored={this.state.totalDelegateRevenueHonored}
                                                totalNotHonored={this.state.totalDelegateRevenueNotHonored}
                                                wilayasRevenue={this.state.delegateWilayasRevenue}
                                                productsRevenue={this.state.delegateProductsRevenue}
                                            ></RevenuePanel>
                                        )
                                }
                            </div>
                        </CompoundBox>
                    </div>
                </div >
            );
        }
    }
}

export default RevenuePage;
