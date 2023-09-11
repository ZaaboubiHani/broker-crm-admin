import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import ExpenseModel from "../models/expense.model";
import ExpenseUserModel from "../models/expense-user.model";

export default class ExpenseService {

    async getAllExpensesOfUserByDateMoth(date: Date, userId: number): Promise<ExpenseModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/expenses-days?filters[userExpense][user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&filters[userExpense][userValidation][$eq]=true`,
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
        var response = await axios.get(`${Globals.apiUrl}/expenses-users?filters[user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&filters[userValidation][$eq]=true`,
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
}