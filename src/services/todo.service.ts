import axios from "axios";
import TodoModel from "../models/todo.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";



export default class TodoService {
    private static _instance: TodoService | null = null;

    private constructor() {
    }

    static getInstance(): TodoService {
        if (!TodoService._instance) {
            TodoService._instance = new TodoService();
        }
        return TodoService._instance;
    }

    async getAllTodosOfDelegate(userId: number, page: number, size: number): Promise<{ todos: TodoModel[], total: number }> {
        const token = localStorage.getItem('token');

        var todos: TodoModel[] = [];
        var response = await axios.get(`${Globals.apiUrl}/todos?filters[delegate][id][$eq]=${userId}&populate=delegate&populate=supervisor&pagination[page]=${page}&pagination[pageSize]=${size}&sort[0]=createdAt:desc`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


        if (response.status == 200) {

            for (let index = 0; index < response.data.data.length; index++) {

                var todo = TodoModel.fromJson(response.data.data[index]);
                todos.push(todo);
            }
            return {
                todos: todos, total: response.data.meta.pagination.total
            };
        }
        return {
            todos: [], total: 0
        };
    }

    async createTodo(todo: TodoModel): Promise<void> {
        const token = localStorage.getItem('token');

        var response = await axios.post(`${Globals.apiUrl}/createTodo`,
            {
                user: todo.delegate!.id,
                action: todo.action,
                task: todo.task,
                region: todo.region,
                startDate: todo.startDate,
                endDate: todo.endDate,
                remark: todo.remark,
                targetRemark: todo.targetRemark,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    }

}