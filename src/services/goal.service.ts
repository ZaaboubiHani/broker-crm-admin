import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import GoalModel from "../models/goal.model";

export default class GoalService {

    async getAllGoalsOfUserByDateMoth(date: Date,superId:number): Promise<GoalModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/goals?filters[users_permissions_user][relatedType][reference][$eq]=delegate&filters[users_permissions_user][creatorId][$eq]=${superId}&filters[goalDate][$startsWithi]=${formatDateToYYYYMM(date)}&populate=users_permissions_user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {
            var result: GoalModel[] = [];
            response.data.data.forEach((goal: any) => {
                result.push(GoalModel.fromJson(goal))
            });
            return result;
        }
        return [];
    }

    async updateGoal(goal: GoalModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/goals/${goal.id}`,
            {
                data: {
                    totalVentes: goal.totalSales,
                    totalVisites: goal.totalVisits
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