import React, { Component } from 'react';
import '../statistics-page/statistics-page.style.css';
import UserService from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import Box from '@mui/material/Box';
import StatisticsService from '../../services/statics.service';
import YearPicker from '../../components/year-picker/year-picker.component';
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';


interface StatisticsPageProps {
    currentUser: UserModel;
    selectedDate: Date;
    isLoading: boolean;
    loadingDelegates: boolean;
    searchText: string;
    delegates: UserModel[];
    supervisors: UserModel[];
    kams: UserModel[];
    selectedDelegate?: UserModel;
    selectedSupervisor?: UserModel;
    selectedKam?: UserModel;
    loadingStatisticsData: boolean;
    visitTaskAreaChart: ApexOptions,
    delegateSuccessRateAreaChart: ApexOptions,
    visitGoalAreaChart: ApexOptions,
    salesAreaChart: ApexOptions,
    kamSalesAreaChart: ApexOptions,
    kamChartPieOptions: ApexOptions,
    chartPieOptions: ApexOptions,
    kamSuccessRateAreaChart: ApexOptions,
    kamVisitTaskAreaChart: ApexOptions,
    teamContributionPieOptions: ApexOptions,
    kamVisitGoalAreaChart: ApexOptions,
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
            currentUser: new UserModel(),
            selectedDate: new Date(),
            isLoading: true,
            searchText: '',
            delegates: [],
            supervisors: [],
            kams: [],
            loadingStatisticsData: false,
            loadingDelegates: false,
            kamChartPieOptions: {
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
            kamSuccessRateAreaChart: {
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
            kamSalesAreaChart: {
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
            kamVisitTaskAreaChart: {
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
            kamVisitGoalAreaChart: {
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

    userService = UserService.getInstance();
    statisticsService = StatisticsService.getInstance();

    handleSelectKam = async (kam: UserModel) => {

        this.setState({ loadingStatisticsData: true, });

        var visitStats = await this.statisticsService.getDelegateYearVisitStats(this.state.selectedDate, kam.id!);
        var salesStats = await this.statisticsService.getDelegateYearSaleStats(this.state.selectedDate, kam.id!);
        var contributionStats = await this.statisticsService.getDelegateContributionStats(this.state.selectedDate, kam.id!, this.state.currentUser.id!);
        var successRate = await this.statisticsService.getDelegateSuccessRateYear(kam.id!, this.state.selectedDate);

        this.state.kamChartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
        this.state.kamChartPieOptions.labels?.splice(0, this.state.kamChartPieOptions.labels?.length);
        this.state.kamChartPieOptions.labels?.push(kam.username!);
        this.state.kamChartPieOptions.labels?.push('reste d\'equipe');

        this.state.kamSuccessRateAreaChart.series = [
            {
                name: 'Total de bon de commandes honores',
                data: successRate.map(e => e.honoredCommands),
            },
            {
                name: 'Total visites',
                data: successRate.map(e => e.totalVisits),
            },
        ];

        this.state.kamSalesAreaChart.series = [
            {
                name: 'Total chiffre d\'affaire',
                data: salesStats.map(e => e.totalSales),
            },
            {
                name: 'Objectifs chiffre d\'affaire',
                data: salesStats.map(e => e.salesGoal),
            },
        ];

        this.state.kamVisitGoalAreaChart.series = [
            {
                name: 'Visites réalisées',
                data: visitStats.map(e => e.numberOfVisits),
            },
            {
                name: 'Objectifs de visites',
                data: visitStats.map(e => e.visitsGoal),
            },
        ];

        this.state.kamVisitTaskAreaChart.series = [
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
            selectedKam: kam,
            loadingStatisticsData: false,
            visitGoalAreaChart: this.state.visitGoalAreaChart,
            visitTaskAreaChart: this.state.visitTaskAreaChart,
            salesAreaChart: this.state.salesAreaChart,
            chartPieOptions: this.state.chartPieOptions,
            teamContributionPieOptions: this.state.teamContributionPieOptions,
        });
    }

    handleSelectDelegate = async (delegate: UserModel) => {

        this.setState({ loadingStatisticsData: true, });

        if (this.state.currentUser.type === UserType.supervisor) {

            var visitStats = await this.statisticsService.getDelegateYearVisitStats(this.state.selectedDate, delegate.id!);
            var salesStats = await this.statisticsService.getDelegateYearSaleStats(this.state.selectedDate, delegate.id!);
            var contributionStats = await this.statisticsService.getDelegateContributionStats(this.state.selectedDate, delegate.id!, this.state.currentUser.id!);
            var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(this.state.selectedDate, this.state.currentUser.id!);
            var teamSalesData = await this.statisticsService.getTeamYearSaleStats(this.state.selectedDate, this.state.currentUser.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateYear(delegate.id!, this.state.selectedDate);

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
                    name: 'Visites réalisées',
                    data: teamVisitsData.map(e => e.numberOfVisits),
                },
                {
                    name: 'Visites programmées',
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
        } else {


            var visitStats = await this.statisticsService.getDelegateYearVisitStats(this.state.selectedDate, delegate.id!);
            var salesStats = await this.statisticsService.getDelegateYearSaleStats(this.state.selectedDate, delegate.id!);
            var successRate = await this.statisticsService.getDelegateSuccessRateYear(delegate.id!, this.state.selectedDate);
            var contributionStats = await this.statisticsService.getDelegateContributionStats(this.state.selectedDate, delegate.id!, this.state.selectedSupervisor!.id!);
            var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(this.state.selectedSupervisor!.id!, this.state.selectedDate,);

            this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
            this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
            delegatesContributions.forEach(e => {
                this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
            });
            this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
            this.state.chartPieOptions.labels?.push(delegate.username!);
            this.state.chartPieOptions.labels?.push('reste d\'equipe');
            this.state.delegatesContributionChartPie.labels?.splice(0, this.state.chartPieOptions.labels?.length);

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
        if (this.state.currentUser.type === UserType.supervisor) {
            if (this.state.selectedDelegate) {
                var visitStats = await this.statisticsService.getDelegateYearVisitStats(date, this.state.selectedDelegate!.id!);
                var salesStats = await this.statisticsService.getDelegateYearSaleStats(date, this.state.selectedDelegate!.id!);
                var contributionStats = await this.statisticsService.getDelegateContributionStats(date, this.state.selectedDelegate!.id!, this.state.currentUser.id!);
                var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(date, this.state.currentUser.id!);
                var teamSalesData = await this.statisticsService.getTeamYearSaleStats(date, this.state.currentUser.id!);
                var successRate = await this.statisticsService.getDelegateSuccessRateYear(this.state.selectedDelegate!.id!, date);

                var teamSuccessRate = await this.statisticsService.getTeamSuccessRateYear(this.state.currentUser.id!, date);
                var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(this.state.currentUser.id!, date,);
                var teamContribution = await this.statisticsService.getTeamContributionsOfSupervisor(this.state.currentUser.id!, date,);

                this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
                this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
                this.state.chartPieOptions.labels?.push(this.state.selectedDelegate!.username!);
                this.state.chartPieOptions.labels?.push('reste d\'equipe');

                this.state.teamContributionPieOptions.series = [teamContribution.teamSales, teamContribution.companySales - teamContribution.teamSales];
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
                        name: 'Visites réalisées',
                        data: teamVisitsData.map(e => e.numberOfVisits),
                    },
                    {
                        name: 'Visites programmées',
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
        } else {

            if (this.state.selectedDelegate) {
                var visitStats = await this.statisticsService.getDelegateYearVisitStats(date, this.state.selectedDelegate!.id!);
                var salesStats = await this.statisticsService.getDelegateYearSaleStats(date, this.state.selectedDelegate!.id!);
                var successRate = await this.statisticsService.getDelegateSuccessRateYear(this.state.selectedDelegate!.id!, date);
                var contributionStats = await this.statisticsService.getDelegateContributionStats(date, this.state.selectedDelegate!.id!, this.state.selectedSupervisor!.id!);
                var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(this.state.selectedSupervisor!.id!, date,);

                this.state.chartPieOptions.series = [contributionStats.delegateSales, contributionStats.teamSales - contributionStats.delegateSales];
                this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
                delegatesContributions.forEach(e => {
                    this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
                });
                this.state.chartPieOptions.labels?.splice(0, this.state.chartPieOptions.labels?.length);
                this.state.chartPieOptions.labels?.push(this.state.selectedDelegate!.username!);
                this.state.chartPieOptions.labels?.push('reste d\'equipe');
                this.state.delegatesContributionChartPie.labels?.splice(0, this.state.chartPieOptions.labels?.length);

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
    }

    handleSelectSupervisor = async (supervisor: UserModel) => {
        this.setState({ loadingDelegates: true, loadingStatisticsData: true, });
        var delegates = await this.userService.getUsersByCreator(supervisor.id!, UserType.delegate);
        var teamVisitsData = await this.statisticsService.getTeamYearVisitStats(this.state.selectedDate, supervisor.id!);
        var teamSalesData = await this.statisticsService.getTeamYearSaleStats(this.state.selectedDate, supervisor.id!);
        var teamSuccessRate = await this.statisticsService.getTeamSuccessRateYear(supervisor.id!, this.state.selectedDate);
        var delegatesContributions = await this.statisticsService.getDelegatesContributionsOfSupervisor(supervisor.id!, this.state.selectedDate,);
        var teamContribution = await this.statisticsService.getTeamContributionsOfSupervisor(supervisor.id!, this.state.selectedDate,);

        this.state.teamContributionPieOptions.series = [teamContribution.teamSales, teamContribution.companySales - teamContribution.teamSales];
        this.state.delegatesContributionChartPie.series = [...delegatesContributions.map(e => e.ChiffreDaffaire)];
        delegatesContributions.forEach(e => {
            this.state.delegatesContributionChartPie.labels?.push(e.delegateName);
        });


        this.state.teamContributionPieOptions.labels?.splice(0, this.state.teamContributionPieOptions.labels?.length);
        this.state.teamContributionPieOptions.labels?.push('equipe');
        this.state.teamContributionPieOptions.labels?.push('entreprise');


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
                name: 'Visites réalisées',
                data: teamVisitsData.map(e => e.numberOfVisits),
            },
            {
                name: 'Visites programmées',
                data: teamVisitsData.map(e => e.numberOfTasks),
            },
        ];
        this.setState({
            selectedSupervisor: supervisor,
            delegates: delegates,
            loadingDelegates: false,
            loadingStatisticsData: false,
        });
    }


    loadStatisticsPageData = async () => {

        var currentUser = await this.userService.getMe();

        if (currentUser != undefined) {
            this.setState({ currentUser: currentUser });
        }

        if (currentUser.type === UserType.supervisor) {
            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);
            this.setState({ delegates: delegates, });
        } else {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);
            var kams = await this.userService.getUsersByCreator(currentUser.id!, UserType.kam);
            this.setState({
                supervisors: supervisors,
                kams: kams,
            });
        }

        this.setState({ isLoading: false, currentUser: currentUser });

    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {
            this.loadStatisticsPageData();
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
                <div className='statistics-container'>
                    <div style={{
                        width: '100%', display: 'flex', flexGrow: '1', minHeight: '100vh'
                    }} >
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Délégué" />
                                    <Tab label={this.state.currentUser.type === UserType.admin ? "Superviseur" : "Équipe"} />
                                    {
                                        this.state.currentUser.type === UserType.admin ? (<Tab label="Kam" />) : undefined
                                    }
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={this.state.index} index={0} >
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
                                    <div style={{ height: '40px', width: '150px', marginRight: '8px' }}>
                                        <UserDropdown
                                            users={this.state.delegates}
                                            selectedUser={this.state.selectedDelegate}
                                            onSelectUser={this.handleSelectDelegate}
                                            label='Délégué'
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <YearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></YearPicker >
                                    </div>
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
                                        <div style={{ marginLeft: '8px', }}>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.salesAreaChart}
                                                    series={this.state.salesAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '4px 0px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.chartPieOptions}
                                                    series={this.state.chartPieOptions.series}
                                                    type="pie"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 4px 0px 0px',
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
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        padding: '16px',
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.visitTaskAreaChart}
                                                    series={this.state.visitTaskAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 4px 0px',
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
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 4px 4px',
                                                        padding: '16px',
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    )

                                }
                            </CustomTabPanel>
                            <CustomTabPanel value={this.state.index} index={1}>
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
                                    <div style={{ display: 'flex' }}>
                                        <YearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></YearPicker >
                                    </div>
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
                                        <div style={{ marginLeft: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                                            <div style={{ display: 'flex', flexGrow: '1' }}>
                                                <ReactApexChart
                                                    options={this.state.teamSalesAreaChart}
                                                    series={this.state.teamSalesAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{

                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '4px 0px 0px 0px',
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
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 4px 0px 0px',
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
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
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
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
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
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 0px 4px',
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
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 4px 0px',
                                                        padding: '16px',
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    )
                                }
                            </CustomTabPanel>
                            <CustomTabPanel value={this.state.index} index={2} >
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '16px' }}>

                                    <div style={{ height: '40px', width: '150px', marginRight: '8px', marginLeft: '8px' }}>
                                        <UserDropdown
                                            users={this.state.kams}
                                            selectedUser={this.state.selectedKam}
                                            onSelectUser={this.handleSelectKam}
                                            label='Kam'
                                        />
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <YearPicker initialDate={this.state.selectedDate} onPick={this.handleOnPickDate}></YearPicker >
                                    </div>
                                </div>
                                {
                                    this.state.loadingStatisticsData ? (
                                        <div style={{
                                            display: 'flex',
                                            flexGrow: '1',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '700px'
                                        }}>
                                            <DotSpinner
                                                size={40}
                                                speed={0.9}
                                                color="black"
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ marginLeft: '8px', }}>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.kamSalesAreaChart}
                                                    series={this.state.kamSalesAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '4px 0px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.kamChartPieOptions}
                                                    series={this.state.kamChartPieOptions.series}
                                                    type="pie"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 4px 0px 0px',
                                                        padding: '16px'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.kamVisitGoalAreaChart}
                                                    series={this.state.kamVisitGoalAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        padding: '16px',
                                                    }}
                                                />
                                                <ReactApexChart
                                                    options={this.state.kamVisitTaskAreaChart}
                                                    series={this.state.kamVisitTaskAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 4px 0px',
                                                        padding: '16px',
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <ReactApexChart
                                                    options={this.state.kamSuccessRateAreaChart}
                                                    series={this.state.kamSuccessRateAreaChart.series}
                                                    type="area"
                                                    height={350}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '50%',
                                                        border: 'solid rgba(0,0,0,0.2) 1px',
                                                        borderRadius: '0px 0px 4px 4px',
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
                </div >
            );
        }
    }
}


export default StatisticsPage;
