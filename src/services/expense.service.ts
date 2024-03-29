import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import ExpenseModel from "../models/expense.model";
import ExpenseUserModel from "../models/expense-user.model";
import ExpenseConfigModel from "../models/expense-config.model";

export default class ExpenseService {
    private static _instance: ExpenseService | null = null;

    private constructor() {
    }
  
    static getInstance(): ExpenseService {
      if (!ExpenseService._instance) {
        ExpenseService._instance = new ExpenseService();
      }
      return ExpenseService._instance;
    }
    async getAllExpensesOfUserByDateMoth(date: Date, userId: number): Promise<ExpenseModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/expenses-days?filters[userExpense][user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&populate=proofs&pagination[pageSize]=31`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {
            var result: ExpenseModel[] = [];
            response.data.data.forEach((exp: any) => {
                result.push(ExpenseModel.fromJson(exp))
            });
            return result;
        }
        return [];
    }
    async getAllExpensesOfUserFromTo(date1: Date, date2: Date, userId: number): Promise<ExpenseModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/expenses-days?filters[userExpense][user][id][$eq]=${userId}&filters[createdDate][$gte]=${formatDateToYYYYMMDD(date1)}&filters[createdDate][$lt]=${formatDateToYYYYMMDD(date2)}&pagination[pageSize]=31`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {
            var result: ExpenseModel[] = [];
            response.data.data.forEach((exp: any) => {
                result.push(ExpenseModel.fromJson(exp))
            });
            return result;
        }
        return [];
    }

    async getExpensesUserByDateMoth(date: Date, userId: number): Promise<ExpenseUserModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/expenses-users?filters[user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&pagination[pageSize]=31`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {
            return ExpenseUserModel.fromJson(response.data.data[0]);
        }
        return new ExpenseUserModel({});
    }

    async validateExpensesUser(expensesUserId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/expenses-users/${expensesUserId}`,
            {
                data: {
                    adminValidation: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return true;
        }
        return false;
    }

    async getExpensesConfig(): Promise<ExpenseConfigModel | undefined> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/expenses-configs`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {

            return ExpenseConfigModel.fromJson(response.data.data[0]);
        }
        return undefined;
    }

    async createExpensesConfig(): Promise<ExpenseConfigModel | undefined> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/expenses-configs`,
            {
                data: {
                    reference: null,
                    kmPrice: 0,
                    nightPrice: 0
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {

            return ExpenseConfigModel.fromJson(response.data.data);
        }
        return undefined;
    }

    async updateExpensesConfig(expensesConfig: ExpenseConfigModel): Promise<ExpenseConfigModel | undefined> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/expenses-configs/${expensesConfig.id}`,
            {
                data: {
                    kmPrice: expensesConfig.kmPrice,
                    nightPrice: expensesConfig.nightPrice
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            return ExpenseConfigModel.fromJson(response.data.data);
        }
        return undefined;
    }
}