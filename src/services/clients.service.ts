import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import ClientModel from "../models/client.model";

export default class ClientService {
    private static _instance: ClientService | null = null;

    private constructor() {
    }
  
    static getInstance(): ClientService {
      if (!ClientService._instance) {
        ClientService._instance = new ClientService();
      }
      return ClientService._instance;
    }

    async getAllClients(): Promise<ClientModel[]> {
        const token = localStorage.getItem('token');
        var result: ClientModel[] = [];
        let page = 1;
        while (true) {
            var response = await axios.get(`${Globals.apiUrl}/clients?pagination[page]=${page}&pagination[pageSize]=100&populate[relatedSpeciality][populate]=domainType`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status == 200 && response.data.data.length > 0) {
                
                response.data.data.forEach((client: any) => {
                    result.push(ClientModel.fromJson(client))
                });
            }
            if(response.data.data.length == 0){

                break;
            }
            page ++;
        }
        return result;
    }

}