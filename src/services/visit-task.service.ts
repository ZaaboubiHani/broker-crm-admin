import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import VisitTaskModel from "../models/visit-task.model";



export default class VisitTaskService {
    private static _instance: VisitTaskService | null = null;

    private constructor() {
    }

    static getInstance(): VisitTaskService {
        if (!VisitTaskService._instance) {
            VisitTaskService._instance = new VisitTaskService();
        }
        return VisitTaskService._instance;
    }

    async getAllVisitsTasks(date: Date, userId: number): Promise<VisitTaskModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/taskVisitStats?user=${userId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            const visitTasks: VisitTaskModel[] = [];
            const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
            const allDays = Array.from(
                { length: lastDayOfMonth - firstDayOfMonth + 1 },
                (_, index) => firstDayOfMonth + index
            );
            for (let i = 0; i < response.data.finalResult.resultArray.length; i++) {
                const visitTask = VisitTaskModel.fromJson(response.data.finalResult.resultArray[i]);
                const visitDay = visitTask.date!.getDate();
                const index = allDays.indexOf(visitDay);
                if (index !== -1) {
                    allDays.splice(index, 1);
                }

                visitTasks.push(visitTask);
            }

            allDays.forEach(day => {
                const defaultVisitTask = new VisitTaskModel({
                    date: new Date(date.getFullYear(), date.getMonth(), day),
                    tasksWilayasCommunes: [],
                    visitsWilayasCommunes: [],
                    numTasks: 0,
                    numVisits: 0,
                });
                visitTasks.push(defaultVisitTask);
            });
            visitTasks.sort((a, b) => b.date!.getTime() - a.date!.getTime());

            return visitTasks;
        }
        return [];
    }
}