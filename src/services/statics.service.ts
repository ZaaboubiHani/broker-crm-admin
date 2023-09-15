import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";



export default class StatisticsService {

    async getPlanDeTournee(date: Date, userId: number): Promise<number> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/planDeTournee?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.percentage || 0;
        }
        return 0;
    }

    async getCouverturePortfeuille(date: Date, userId: number): Promise<number> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/couverturePortfeuille?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.couverturePortfeuille || 0;
        }
        return 0;
    }

    async getMoyenneVisitesParJour(date: Date, userId: number): Promise<number> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/moyenneVisitesParJour?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.moyenneVisitesParJour || 0;
        }
        return 0;
    }

    async getObjectifChiffreDaffaire(date: Date, userId: number, isHonored?: boolean): Promise<number> {

        const token = localStorage.getItem('token');
        var honoredFilter = '';
        if (isHonored) {
            honoredFilter = `&isHonored=${isHonored}`;
        }

        var response = await axios.get(`${Globals.apiUrl}/objectifChiffreDaffaire?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}${honoredFilter}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.objectifChiffreDaffaire || 0;
        }

        return 0;
    }

    async getObjectifVisites(date: Date, userId: number): Promise<number> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/objectifVisites?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.objectifVisites || 0;
        }

        return 0;
    }

    async getTotalTeamRevenue(date: Date, isHonored?: boolean): Promise<number> {

        const token = localStorage.getItem('token');
        var honorFilter: string = ''
        if (isHonored !== undefined) {
            honorFilter = `&isHonored=${isHonored}`;
        }

        var response = await axios.get(`${Globals.apiUrl}/totalChiffreDaffaireEquipe?supervisor=2&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}${honorFilter}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.totalChiffreDaffaireEquipe || 0;
        }

        return 0;
    }
    async getTotalUserRevenue(date: Date, userId: number, isHonored?: boolean): Promise<number> {

        const token = localStorage.getItem('token');
        var honorFilter: string = ''
        if (isHonored !== undefined) {
            honorFilter = `&isHonored=${isHonored}`;
        }

        var response = await axios.get(`${Globals.apiUrl}/totalChiffreDaffaireDelegate?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}${honorFilter}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data.totalChiffreDaffaireDelegate || 0;
        }

        return 0;
    }

    async getUserWilayasRevenue(date: Date, userId: number,): Promise<{ wilaya: string, total: number, percentage: number }[]> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/ventesDelegateParWilaya?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var revenues: { wilaya: string, total: number, percentage: number }[] = [];
            response.data.ventesDelegateParWilaya.forEach((element: any) => { revenues.push({ wilaya: element.Wilaya, total: element.total, percentage: element.percentage }) });
            return revenues;
        }

        return [];
    }

    async getUserProductsRevenue(date: Date, userId: number,): Promise<{ product: string, quantity: number, total: number, percentage: number }[]> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/ventesDelegateParProduit?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var revenues: { product: string, quantity: number, total: number, percentage: number }[] = [];
            response.data.ventesDelegateParProduit.forEach((element: any) => { revenues.push({ product: element.product, quantity: element.quantity, total: element.total, percentage: element.percentage }) });
            return revenues;
        }

        return [];
    }

    async getDelegateYearVisitStats(date: Date, userId: number,): Promise<{ month: string, numberOfTasks: number, numberOfVisits: number, visitsGoal: number }[]> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/delegateYearVisitStats?user=${userId}&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var stats: { month: string, numberOfTasks: number, numberOfVisits: number, visitsGoal: number }[] = [];
            response.data.result.forEach((element: any) => { stats.push({ month: element.month, numberOfTasks: element.numberOfTasks, numberOfVisits: element.numberOfVisits, visitsGoal: element.visitsGoal }) });
            return stats;
        }

        return [];
    }

    async getDelegateYearSaleStats(date: Date, userId: number,): Promise<{ month: string, totalSales: number, salesGoal: number }[]> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/delegateYearSaleStats?user=${userId}&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var stats: { month: string, totalSales: number, salesGoal: number }[] = [];
            response.data.result.forEach((element: any) => { stats.push({ month: element.month, totalSales: element.totalSales, salesGoal: element.salesGoal }) });
            return stats;
        }

        return [];
    }

    async getDelegateContributionStats(date: Date, userId: number,): Promise<{ teamSales: number, delegateSales: number }> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/contributionDelegateTeam?supervisor=2&user=${userId}&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return response.data;
        }

        return { teamSales: 0, delegateSales: 0 };
    }
    async getTeamYearVisitStats(date: Date): Promise<{ month: string, numberOfTasks: number, numberOfVisits: number, visitsGoal: number }[]> {

        const token = localStorage.getItem('token');


        var response = await axios.get(`${Globals.apiUrl}/teamYearVisitStats?supervisor=2&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var stats: { month: string, numberOfTasks: number, numberOfVisits: number, visitsGoal: number }[] = [];
            response.data.result.forEach((element: any) => { stats.push({ month: element.month, numberOfTasks: element.numberOfTasks, numberOfVisits: element.numberOfVisits, visitsGoal: element.visitsGoal }) });
            return stats;
        }

        return [];
    }

    async getTeamYearSaleStats(date: Date): Promise<{ month: string, totalSales: number }[]> {

        const token = localStorage.getItem('token');

        var response = await axios.get(`${Globals.apiUrl}/teamYearSaleStats?supervisor=2&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var stats: { month: string, totalSales: number }[] = [];
            response.data.output.forEach((element: any) => { stats.push({ month: element.month, totalSales: element.totalSales }) });
            return stats;
        }

        return [];
    }

    async getDelegateSuccessRateMonth(date: Date, userId: number,): Promise<number> {

        const token = localStorage.getItem('token');

        var response = await axios.get(`${Globals.apiUrl}/delegateSuccessRate?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {

            return response.data.delegateSuccessRate || 0;
        }

        return 0;
    }

    async getDelegateSuccessRateYear(userId: number, date: Date): Promise<{ honoredCommands: number, totalVisits: number }[]> {

        const token = localStorage.getItem('token');

        var response = await axios.get(`${Globals.apiUrl}/delegateYearSuccessRate?user=${userId}&year=${formatDateToYYYY(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var result: { honoredCommands: number, totalVisits: number }[] = [];
            response.data.output.forEach((e: any) => result.push({ honoredCommands: e.honoredCommands, totalVisits: e.totalVisits }));
            return result;
        }

        return [];
    }


}