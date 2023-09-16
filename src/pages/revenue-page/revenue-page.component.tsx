
import { Component } from 'react';
import '../revenue-page/revenue-page.style.css';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DotSpinner } from '@uiball/loaders';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../services/user.service';
import RevenueService from '../../services/revenue.service';
import RevenueModel from '../../models/revenue.model';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import RevenueTable from '../../components/revenue-table/revenue-table.component';
import StatisticsService from '../../services/statics.service';
import RevenuePanel from '../../components/revenue-panel/revenue-panel.component';
import CircularProgressLabel from '../../components/circular-progress-label/circular-progress-label.component';

interface RevenuePageProps {
    selectedDate: Date;
    hasData: boolean;
    isLoading: boolean;
    searchText: string;
    loadingRevenuesData: boolean;
    loadingRevenueData: boolean;
    revenues: RevenueModel[];
    filteredRevenues: RevenueModel[];
    totalTeamRevenue: number;
    totalTeamRevenueHonored: number;
    totalTeamRevenueNotHonored: number;
    delegateWilayasRevenue: { wilaya: string, total: number, percentage: number }[];
    delegateProductsRevenue: { product: string, quantity: number, total: number, percentage: number }[];
    totalDelegateRevenue: number;
    totalDelegateRevenueHonored: number;
    totalDelegateRevenueNotHonored: number;
    showDetails: boolean;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class RevenuePage extends Component<{}, RevenuePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            selectedDate: new Date(),
            hasData: false,
            isLoading: false,
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
        }
    }

    userService = new UserService();
    revenueService = new RevenueService();
    statisticsService = new StatisticsService();

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
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var revenues = await this.revenueService.getAllRevenuesMonth(new Date());
            var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(new Date());
            var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(new Date(), true);
            var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(new Date(), false);
            this.setState({
                revenues: revenues,
                filteredRevenues: revenues,
                totalTeamRevenue: totalTeamRevenue,
                totalTeamRevenueHonored: totalTeamRevenueHonored,
                totalTeamRevenueNotHonored: totalTeamRevenueNotHonored,
                isLoading: false,
                hasData: true,
            });
        }
    };

    handleOnPickDate = async (date: Date) => {
        this.setState({ loadingRevenuesData: true, showDetails: false });
        var revenues = await this.revenueService.getAllRevenuesMonth(date);
        var totalTeamRevenue = await this.statisticsService.getTotalTeamRevenue(date);
        var totalTeamRevenueHonored = await this.statisticsService.getTotalTeamRevenue(date, true);
        var totalTeamRevenueNotHonored = await this.statisticsService.getTotalTeamRevenue(date, false);
        this.setState({ selectedDate: date, revenues: revenues, loadingRevenuesData: false, filteredRevenues: revenues, totalTeamRevenue: totalTeamRevenue, totalTeamRevenueHonored: totalTeamRevenueHonored, totalTeamRevenueNotHonored: totalTeamRevenueNotHonored });
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

    render() {

        if (!this.state.hasData) {
            this.loadRevenuePageData();
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
                        <Form >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                            </Form.Group>
                        </Form>
                        <button onClick={this.handleRevenuesFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px', margin: '0px 0px 0px 8px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                        </button>
                        <MonthYearPicker onPick={this.handleOnPickDate}></MonthYearPicker >
                    </div>
                    <div style={{ margin: '0px 8px', display: 'flex', justifyContent: 'space-between', padding: '4px', backgroundColor: 'white', borderRadius: '8px' }}>
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
                            value={this.state.totalTeamRevenueHonored / this.state.totalTeamRevenue * 100} />
                        <CircularProgressLabel
                            colorStroke='#38EB5D'
                            direction='row'
                            secondTitle="Total non honore:"
                            firstTitle={this.state.totalTeamRevenueNotHonored?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                            value={this.state.totalTeamRevenueNotHonored / this.state.totalTeamRevenue * 100} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1' }}>
                        <RevenueTable id='revenue-table' data={this.state.filteredRevenues} isLoading={this.state.loadingRevenuesData} displayDetails={this.handleDisplayDetails}></RevenueTable>
                        <div className='user-panel'>
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
                                        <RevenuePanel showData={this.state.showDetails} total={this.state.totalDelegateRevenue} totalHonored={this.state.totalDelegateRevenueHonored} totalNotHonored={this.state.totalDelegateRevenueNotHonored} wilayasRevenue={this.state.delegateWilayasRevenue} productsRevenue={this.state.delegateProductsRevenue}></RevenuePanel>
                                    )
                            }
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default RevenuePage;
