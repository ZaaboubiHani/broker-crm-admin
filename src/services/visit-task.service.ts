import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import VisitTaskModel from "../models/visit-task.model";



export default class VisitTaskService {

    async getAllVisitsTasks(date: Date,userId:number): Promise<VisitTaskModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/taskVisitStats?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var visitTasks: VisitTaskModel[] = [];
            for (let i = 0; i < response.data.finalResult.resultArray.length; i++) {
                var visitTask = VisitTaskModel.fromJson(response.data.finalResult.resultArray[i]);
                visitTasks.push(visitTask);
            }
            return visitTasks;
        }
        return [];
    }
}