import axios from "axios";
import CommandModel from "../models/command.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";




export default class CommandService {

    async getCommandOfVisit(visitId: number): Promise<CommandModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/commands?filters[visit][id][$eq]=${visitId}&populate=products.product&populate=suppliers.supplier&populate=motivations&populate=visit.client`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200 && response.data.data.length > 0) {
            var command = CommandModel.fromJson(response.data['data'][0]);
            return command;
        }
        return new CommandModel();
    }

    async getAllCommandsOfDelegate(date: Date, userId: number): Promise<CommandModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/commands?filters[visit][user][id][$eq]=${userId}&filters[visit][createdDate][$containsi]=${formatDateToYYYYMM(date)}&populate=products.product&populate=suppliers.supplier&populate=motivations&populate=visit.client&populate=commandSupplier.supplier`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200 && response.data.data.length > 0) {
            var commands: CommandModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var command = CommandModel.fromJson(response.data['data'][index]);
                commands.push(command);
            }
            return commands;
        }
        return [];
    }

    async honorCommand(commandId: number, supplierId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/honorDishonor?command=${commandId}&honor=true&supplier=${supplierId}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        console.log(response);
        if (response.status == 200) {

            return true;
        }
        return false;
    }
    async dishonorCommand(commandId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/honorDishonor?command=${commandId}&honor=false`,
            {},
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