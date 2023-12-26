import axios from "axios";
import TaskModel from "../models/task.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";



export default class TaskService {
    private static _instance: TaskService | null = null;

    private constructor() {
    }
  
    static getInstance(): TaskService {
      if (!TaskService._instance) {
        TaskService._instance = new TaskService();
      }
      return TaskService._instance;
    }
  
    async getAllTasksOfDelegate(date: Date,userId:number): Promise<TaskModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/task-clients?filters[visitDate][$containsi]=${formatDateToYYYYMMDD(date)}&filters[task][delegate][id][$eq]=${userId}&populate=task.delegate&populate=client.relatedSpeciality`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            
        if (response.status == 200) {
            var tasks: TaskModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
               
                var task = TaskModel.fromJson(response.data.data[index]);
                tasks.push(task);
            }
            return tasks;
        }
        return [];
    }

}