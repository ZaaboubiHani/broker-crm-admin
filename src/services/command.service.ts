import axios from "axios";
import CommandModel from "../models/command.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";




export default class CommandService {
    private static _instance: CommandService | null = null;

    private constructor() {
    }
  
    static getInstance(): CommandService {
      if (!CommandService._instance) {
        CommandService._instance = new CommandService();
      }
      return CommandService._instance;
    }
    async getCommandOfVisit(visitId: number): Promise<CommandModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/commands?publicationState=preview&filters[visit][id][$eq]=${visitId}&populate=products.product&populate=suppliers.supplier&populate=motivations&populate=visit.client.relatedSpeciality.domainType&populate=invoice&populate=signature`,
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

    async getAllCommandsOfDelegate(page: number, size: number, date: Date, userId: number): Promise<{ commands: CommandModel[], total: number }> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/commands?publicationState=preview&filters[visit][user][id][$eq]=${userId}&pagination[page]=${page}&pagination[pageSize]=${size}&filters[visit][createdDate][$containsi]=${formatDateToYYYYMM(date)}&populate=products.product&populate=suppliers.supplier&populate=motivations&populate=visit.client.relatedSpeciality.domainType&populate=commandSupplier.supplier&populate=invoice&populate=signature`,
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
            return { commands: commands, total: response.data.meta.pagination.total };
        }
        return { commands: [], total: 0 };
    }

    async honorCommand(commandId: number, supplierId?: number): Promise<boolean> {
        const token = localStorage.getItem('token');
    
        var response = await axios.put(`${Globals.apiUrl}/honorDishonor`,
            {},
            {
                params:{
                    command:commandId,
                    honor:true,
                    supplier:supplierId,
                },
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