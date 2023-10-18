import React, { Component } from 'react';
import '../statistics-page/statistics-page.style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/esm/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserPicker from '../../components/user-picker/user-picker.component';
import UserService from '../../services/user.service';
import UserModel from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StatisticsService from '../../services/statics.service';
import YearPicker from '../../components/year-picker/year-picker.component';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';


interface StatisticsPageProps {
    currentUser:UserModel;
    selectedDate: Date;
    isLoading: boolean;
    hasData: boolean;
    searchText: string;
    delegates: UserModel[];
    filtredDelegates: UserModel[];
    selectedDelegate?: UserModel;
    loadingStatisticsData: boolean;
    visitTaskAreaChart: ApexOptions,
    delegateSuccessRateAreaChart: ApexOptions,
    visitGoalAreaChart: ApexOptions,
    salesAreaChart: ApexOptions,
    chartPieOptions: ApexOptions,
    teamContributionPieOptions: ApexOptions,
    delegatesContributionChartPie: ApexOptions,
    teamSalesAreaChart: ApexOptions,
    teamSuccessRateAreaChart: ApexOptions,
    teamVisitGoalAreaChart: ApexOptions,
    teamVisitTaskAreaChart: ApexOptions,
    index: number;
}

class StatisticsPage extends Component<{}, StatisticsPageProps> {
    constructor({ }) {
        super({});
        this.state = {
            currentUser:new UserModel(),
            selectedDate: new Date(),
            isLoading: false,
            hasData: false,
            searchText: '',
            delegates: [],
            filtredDelegates: [],
            loadingStatisticsData: false,
            chartPieOptions: {
                chart: {
                    type: 'pie',
                },
                fill: {
                    type: 'gradient',
                },
                series: [],
                labels: [],
                colors: ['#2AEB80', '#FF5747'],
                title: {
                    text: 'Diagramme de contribution au chiffre d\'affaire annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                }
            },
            teamContributionPieOptions: {
                chart: {
                    type: 'pie',
                },
                fill: {
                    type: 'gradient',
                },
                series: [],
                labels: [],
                colors: ['#2AEB80', '#FF5747'],
                title: {
                    text: 'Diagramme de contribution au chiffre d\'affaire annuel d\'equipe',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                }
            },
            delegatesContributionChartPie: {
                chart: {
                    type: 'pie',
                },
                fill: {
                    type: 'gradient',
                },
                series: [],
                labels: [],
                title: {
                    text: 'Diagramme de contribution au chiffre d\'affaire annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                }
            },
            delegateSuccessRateAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe des taux de réussite annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#CC38E0', '#2AEB80'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            teamSuccessRateAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe des taux de réussite annuel de l\'équipe',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#CC38E0', '#2AEB80'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            salesAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe des objectifs de ventes annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#CC38E0', '#6571EB'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            visitTaskAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe du plan de tournee annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#38EB5D', '#EA572C'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            visitGoalAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe des objectifs de visites annuel',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#38EB5D', '#2FBCEB'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            teamSalesAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe de ventes annuel de l\'équipe',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#CC38E0', '#6571EB'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            teamVisitGoalAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe des objectifs de visites annuel de l\'équipe',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#38EB5D', '#2FBCEB'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            teamVisitTaskAreaChart: {
                chart: {
                    type: 'area',
                },
                title: {
                    text: 'Graphe du plan de tournee annuel de l\'équipe',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#263238'
                    },
                },
                colors: ['#38EB5D', '#EA572C'],
                series: [],
                xaxis: {
                    categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                }
            },
            index: 0,
        }
    }


    userService = new UserService();
    statisticsService = new StatisticsService();

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

        this.setState({ loadingStatisticsData: true, });

        var visitStats = await this.statisticsService.getDelegateYearVisitStats(this.state.selectedDate, delegate!.id!);
        var salesStats = await this.statisticsService.getDelegateYearSaleStats(this.state.selectedDate, delegate!.id!);
        var contributionStats = await this.statisticsService.getDelegateContributionStats(this.state.selectedDate, delegate!.id!,this.state.currentUser.id!);
        var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(this.state.selectedDate,this.state.currentUser.id!);
        var teamSalesData = await this.statisticsService.getTeamYearSaleStats(this.state.selectedDate,this.state.currentUser.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateYear(delegate!.id!, this.state.selectedDate);
       
        var teamSuccessRate = await this.statisticsService.getTeamSuccessRateYear(this.state.currentUser.id!, this.state.selectedDate);
        var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(this.state.currentUser.id!, this.state.selectedDate,);
        var teamContribution = await this.statisticsService.getTeamContributionsOfSupervisor(this.state.currentUser.id!, this.state.selectedDate,);

        this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
        this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
        this.state.chartPieOptions.labels?.push(delegate.username!);
        this.state.chartPieOptions.labels?.push('reste d\'equipe');

        this.state.teamContributionPieOptions.series = [teamContribution.teamSales, teamContribution.companySales - teamContribution.teamSales];
        this.state.teamContributionPieOptions.labels?.splice(0, this.state.teamContributionPieOptions.labels?.length);
        this.state.teamContributionPieOptions.labels?.push('equipe');
        this.state.teamContributionPieOptions.labels?.push('entreprise');

        this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
        this.state.delegatesContributionChartPie.labels?.splice(0, this.state.delegatesContributionChartPie.labels?.length);
        delegatesContributions.forEach(e => {
            this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
        });


        this.state.delegateSuccessRateAreaChart.series = [
            {
                name: 'Total de bon de commandes honores',
                data: successRate.map(e => e.honoredCommands),
            },
            {
                name: 'Total visites',
                data: successRate.map(e => e.totalVisits),
            },
        ];

        this.state.teamSuccessRateAreaChart.series = [
            {
                name: 'Total de bon de commandes honores',
                data: teamSuccessRate.map(e => e.honoredCommands),
            },
            {
                name: 'Total visites',
                data: teamSuccessRate.map(e => e.totalVisits),
            },
        ];

        this.state.teamSalesAreaChart.series = [
            {
                name: 'Total des ventes',
                data: teamSalesData.map(e => e.totalSales),
            },
            {
                name: 'Objectifs chiffre d\'affaire',
                data: teamSalesData.map(e => e.salesGoal),
            },
        ];

        this.state.teamVisitGoalAreaChart.series = [
            {
                name: 'Total visites',
                data: teamVisitsData.map(e => e.numberOfVisits),
            },
            {
                name: 'Objectifs de visites',
                data: teamVisitsData.map(e => e.visitsGoal),
            },
        ];

        this.state.teamVisitTaskAreaChart.series = [
            {
                name: 'Total visites',
                data: teamVisitsData.map(e => e.numberOfVisits),
            },
            {
                name: 'Objectifs de visites',
                data: teamVisitsData.map(e => e.numberOfTasks),
            },
        ];

        this.state.salesAreaChart.series = [
            {
                name: 'Total chiffre d\'affaire',
                data: salesStats.map(e => e.totalSales),
            },
            {
                name: 'Objectifs chiffre d\'affaire',
                data: salesStats.map(e => e.salesGoal),
            },
        ];

        this.state.visitGoalAreaChart.series = [
            {
                name: 'Visites réalisées',
                data: visitStats.map(e => e.numberOfVisits),
            },
            {
                name: 'Objectifs de visites',
                data: visitStats.map(e => e.visitsGoal),
            },
        ];

        this.state.visitTaskAreaChart.series = [
            {
                name: 'Visites réalisées',
                data: visitStats.map(e => e.numberOfVisits),
            },
            {
                name: 'visites programmées',
                data: visitStats.map(e => e.numberOfTasks),
            },
        ];

        this.setState({
            selectedDelegate: delegate,
            loadingStatisticsData: false,
            visitGoalAreaChart: this.state.visitGoalAreaChart,
            visitTaskAreaChart: this.state.visitTaskAreaChart,
            salesAreaChart: this.state.salesAreaChart,
            chartPieOptions: this.state.chartPieOptions,
            teamContributionPieOptions: this.state.teamContributionPieOptions,
        });
    }

    handleOnPickDate = async (date: Date) => {

        this.setState({ loadingStatisticsData: true, });

        if (this.state.selectedDelegate) {
            var visitStats = await this.statisticsService.getDelegateYearVisitStats(date, this.state.selectedDelegate!.id!);
            var salesStats = await this.statisticsService.getDelegateYearSaleStats(date, this.state.selectedDelegate!.id!);
            var contributionStats = await this.statisticsService.getDelegateContributionStats(date, this.state.selectedDelegate!.id!,this.state.currentUser.id!);
            var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(date,this.state.currentUser.id!);
            var teamSalesData = await this.statisticsService.getTeamYearSaleStats(date,this.state.currentUser.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateYear(this.state.selectedDelegate!.id!, date);

            var teamSuccessRate = await this.statisticsService.getTeamSuccessRateYear(this.state.currentUser.id!, date);
            var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(this.state.currentUser.id!, date,);
            var teamContribution = await this.statisticsService.getTeamContributionsOfSupervisor(this.state.currentUser.id!, date,);

            this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
            this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
            this.state.chartPieOptions.labels?.push(this.state.selectedDelegate!.username!);
            this.state.chartPieOptions.labels?.push('reste d\'equipe');

            this.state.teamContributionPieOptions.series = [teamContribution.teamSales,teamContribution.companySales - teamContribution.teamSales];
            this.state.teamContributionPieOptions.labels?.splice(0, this.state.teamContributionPieOptions.labels?.length);
            this.state.teamContributionPieOptions.labels?.push('equipe');
            this.state.teamContributionPieOptions.labels?.push('entreprise');

            this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
            this.state.delegatesContributionChartPie.labels?.splice(0, this.state.chartPieOptions.labels?.length);
            delegatesContributions.forEach(e => {
                this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
            });

            this.state.delegateSuccessRateAreaChart.series = [
                {
                    name: 'Total de bon de commandes honores',
                    data: successRate.map(e => e.honoredCommands),
                },
                {
                    name: 'Total visites',
                    data: successRate.map(e => e.totalVisits),
                },
            ];

            this.state.teamSuccessRateAreaChart.series = [
                {
                    name: 'Total de bon de commandes honores',
                    data: teamSuccessRate.map(e => e.honoredCommands),
                },
                {
                    name: 'Total visites',
                    data: teamSuccessRate.map(e => e.totalVisits),
                },
            ];

            this.state.teamSalesAreaChart.series = [
                {
                    name: 'Total des ventes',
                    data: teamSalesData.map(e => e.totalSales),
                },
                {
                    name: 'Objectifs chiffre d\'affaire',
                    data: teamSalesData.map(e => e.salesGoal),
                },
            ];

            this.state.teamVisitGoalAreaChart.series = [
                {
                    name: 'Total visites',
                    data: teamVisitsData.map(e => e.numberOfVisits),
                },
                {
                    name: 'Objectifs de visites',
                    data: teamVisitsData.map(e => e.visitsGoal),
                },
            ];
            this.state.teamVisitTaskAreaChart.series = [
                {
                    name: 'Total visites',
                    data: teamVisitsData.map(e => e.numberOfVisits),
                },
                {
                    name: 'Objectifs de visites',
                    data: teamVisitsData.map(e => e.numberOfTasks),
                },
            ];

            this.state.salesAreaChart.series = [
                {
                    name: 'Total chiffre d\'affaire',
                    data: salesStats.map(e => e.totalSales),
                },
                {
                    name: 'Objectifs chiffre d\'affaire',
                    data: salesStats.map(e => e.salesGoal),
                },
            ];

            this.state.visitGoalAreaChart.series = [
                {
                    name: 'Visites réalisées',
                    data: visitStats.map(e => e.numberOfVisits),
                },
                {
                    name: 'Objectifs de visites',
                    data: visitStats.map(e => e.visitsGoal),
                },
            ];

            this.state.visitTaskAreaChart.series = [
                {
                    name: 'Visites réalisées',
                    data: visitStats.map(e => e.numberOfVisits),
                },
                {
                    name: 'visites programmées',
                    data: visitStats.map(e => e.numberOfTasks),
                },
            ];
        }

        this.setState({
            selectedDate: date,
            loadingStatisticsData: false,
            visitGoalAreaChart: this.state.visitGoalAreaChart,
            visitTaskAreaChart: this.state.visitTaskAreaChart,
            salesAreaChart: this.state.salesAreaChart,
            chartPieOptions: this.state.chartPieOptions,
            teamContributionPieOptions: this.state.teamContributionPieOptions,
        });
    }

    loadStatisticsPageData = async () => {

        this.setState({ isLoading: true });

        if (!this.state.isLoading) {
            var delegates = await this.userService.getDelegateUsers();
            var currentUser = await this.userService.getMe();
            if (delegates.length > 0) {
                this.setState({ selectedDelegate: delegates[0] });
                var visitStats = await this.statisticsService.getDelegateYearVisitStats(new Date(), delegates[0].id!);
                var salesStats = await this.statisticsService.getDelegateYearSaleStats(new Date(), delegates[0].id!);
                var contributionStats = await this.statisticsService.getDelegateContributionStats(new Date(), delegates[0].id!,currentUser.id!);
                var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(new Date(),currentUser.id!);
                var successRate = await this.statisticsService.getDelegateSuccessRateYear(delegates[0].id!, new Date());
                var teamSalesData = await this.statisticsService.getTeamYearSaleStats(new Date(),currentUser.id!);

                var teamSuccessRate = await this.statisticsService.getTeamSuccessRateYear(currentUser.id!, new Date());
                var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(currentUser.id!, new Date());
                var teamContribution = await this.statisticsService.getTeamContributionsOfSupervisor(currentUser.id!, new Date());

                this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
                this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
                this.state.chartPieOptions.labels?.push(delegates[0].username!);
                this.state.chartPieOptions.labels?.push('reste d\'equipe');

                this.state.teamContributionPieOptions.series = [teamContribution.teamSales,teamContribution.companySales - teamContribution.teamSales];
                this.state.teamContributionPieOptions.labels?.splice(0, this.state.teamContributionPieOptions.labels?.length);
                this.state.teamContributionPieOptions.labels?.push('equipe');
                this.state.teamContributionPieOptions.labels?.push('entreprise');

                this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
                this.state.delegatesContributionChartPie.labels?.splice(0, this.state.chartPieOptions.labels?.length);
                delegatesContributions.forEach(e => {
                    this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
                });

                this.state.delegateSuccessRateAreaChart.series = [
                    {
                        name: 'Total de bon de commandes honores',
                        data: successRate.map(e => e.honoredCommands),
                    },
                    {
                        name: 'Total visites',
                        data: successRate.map(e => e.totalVisits),
                    },
                ];

                this.state.teamSuccessRateAreaChart.series = [
                    {
                        name: 'Total de bon de commandes honores',
                        data: teamSuccessRate.map(e => e.honoredCommands),
                    },
                    {
                        name: 'Total visites',
                        data: teamSuccessRate.map(e => e.totalVisits),
                    },
                ];

                this.state.teamSalesAreaChart.series = [
                    {
                        name: 'Total des ventes',
                        data: teamSalesData.map(e => e.totalSales),
                    },
                    {
                        name: 'Objectifs chiffre d\'affaire',
                        data: teamSalesData.map(e => e.salesGoal),
                    },
                ];

                this.state.teamVisitGoalAreaChart.series = [
                    {
                        name: 'Total visites',
                        data: teamVisitsData.map(e => e.numberOfVisits),
                    },
                    {
                        name: 'Objectifs de visites',
                        data: teamVisitsData.map(e => e.visitsGoal),
                    },
                ];
                this.state.teamVisitTaskAreaChart.series = [
                    {
                        name: 'Total visites',
                        data: teamVisitsData.map(e => e.numberOfVisits),
                    },
                    {
                        name: 'Objectifs de visites',
                        data: teamVisitsData.map(e => e.numberOfTasks),
                    },
                ];

                this.state.salesAreaChart.series = [
                    {
                        name: 'Total chiffre d\'affaire',
                        data: salesStats.map(e => e.totalSales),
                    },
                    {
                        name: 'Objectifs chiffre d\'affaire',
                        data: salesStats.map(e => e.salesGoal),
                    },
                ];

                this.state.visitGoalAreaChart.series = [
                    {
                        name: 'Visites réalisées',
                        data: visitStats.map(e => e.numberOfVisits),
                    },
                    {
                        name: 'Objectifs de visites',
                        data: visitStats.map(e => e.visitsGoal),
                    },
                ];

                this.state.visitTaskAreaChart.series = [
                    {
                        name: 'Visites réalisées',
                        data: visitStats.map(e => e.numberOfVisits),
                    },
                    {
                        name: 'visites programmées',
                        data: visitStats.map(e => e.numberOfTasks),
                    },
                ];
                this.setState({ loadingStatisticsData: false, visitGoalAreaChart: this.state.visitGoalAreaChart, visitTaskAreaChart: this.state.visitTaskAreaChart, salesAreaChart: this.state.salesAreaChart, chartPieOptions: this.state.chartPieOptions });

            }
            this.setState({ isLoading: false, delegates: delegates, filtredDelegates: delegates, hasData: true,currentUser:currentUser });
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    render() {
        if (!this.state.hasData) {
            this.loadStatisticsPageData();
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
                <div className='statistics-container'>
                    <div style={{
                        width: '100%', display: 'flex', flexGrow: '1', minHeight: '100vh'
                    }} >
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Délégué" />
                                    <Tab label="Équipe" />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={this.state.index} index={0} >
                                <div style={{ display: 'flex', height: '40px' }}>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="search" placeholder="Recherche" onChange={this.handleSearchTextChange} />
                                        </Form.Group>
                                    </Form>
                                    <button onClick={this.handleDelegateFilter} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                                        <FontAwesomeIcon icon={faSearch} style={{ color: 'black' }} />
                                    </button>
                                    <YearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></YearPicker >
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <UserPicker delegates={this.state.filtredDelegates} onSelect={this.handleSelectDelegate}></UserPicker>
                                </div>
                                {
                                    this.state.loadingStatisticsData ? (
                                        <div style={{ display: 'flex', flexGrow: '1', justifyContent: 'center', alignItems: 'center', height: '700px' }}>
                                            <DotSpinner
                                                size={40}
                                                speed={0.9}
                                                color="black"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.salesAreaChart}
                                                    series={this.state.salesAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '16px 0px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.chartPieOptions}
                                                    series={this.state.chartPieOptions.series}
                                                    type="pie"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 16px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.visitGoalAreaChart}
                                                    series={this.state.visitGoalAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        padding: '16px',
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.visitTaskAreaChart}
                                                    series={this.state.visitTaskAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 0px 16px 0px',
                                                        padding: '16px',
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.delegateSuccessRateAreaChart}
                                                    series={this.state.delegateSuccessRateAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 0px 16px 16px',
                                                        padding: '16px',
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    )

                                }
                            </CustomTabPanel>
                            <CustomTabPanel value={this.state.index} index={1}>
                                <div style={{ display: 'flex' }}>
                                    <YearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></YearPicker >
                                </div>
                                {
                                    this.state.loadingStatisticsData ? (
                                        <div style={{ display: 'flex', flexGrow: '1', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
                                            <DotSpinner
                                                size={40}
                                                speed={0.9}
                                                color="black"
                                            />
                                        </div>
                                    ) : (
                                        <div>


                                            <div style={{ display: 'flex', flexGrow: '1' }}>
                                                <ReactApexChart
                                                    options={this.state.teamSalesAreaChart}
                                                    series={this.state.teamSalesAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '16px 0px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.teamVisitGoalAreaChart}
                                                    series={this.state.teamVisitGoalAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 16px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexGrow: '1' }}>
                                                <ReactApexChart
                                                    options={this.state.teamVisitTaskAreaChart}
                                                    series={this.state.teamVisitTaskAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.delegatesContributionChartPie}
                                                    series={this.state.delegatesContributionChartPie.series}
                                                    type="pie"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px',
                                                        padding: '16px'
                                                    }}
                                                />

                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.teamSuccessRateAreaChart}
                                                    series={this.state.teamSuccessRateAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 0px 0px 16px',
                                                        padding: '16px',
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.teamContributionPieOptions}
                                                    series={this.state.teamContributionPieOptions.series}
                                                    type="pie"
                                                    height={350}
                                                    style={{
                                                        width: '50%',
                                                        border: 'solid black 1px',
                                                        borderRadius: '0px 0px 16px 0px',
                                                        padding: '16px',
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    )
                                }
                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            );
        }
    }
}


export default StatisticsPage;
