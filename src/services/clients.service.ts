import axios from "axios";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import ClientModel, { ClientType } from "../models/client.model";

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
            if (response.data.data.length == 0) {

                break;
            }
            page++;
        }
        return result;
    }

    async getClientsPaginated(page: number, size: number, clientType: ClientType, text: string, superId: number, order: boolean, propname?: string, delegateId?: number): Promise<{ clients: ClientModel[], total: number }> {
        const token = localStorage.getItem('token');
        var clients: ClientModel[] = [];
        var delegateFilter = '';
        var sortFilter = '';
        var clientTypeFilter = `&filters[relatedSpeciality][domainType][reference][$eq]=${clientType === ClientType.doctor ? `doctor&filters[visits][user][creatorId][$eq]=${superId}` : clientType === ClientType.pharmacy ? `pharmacy&filters[visits][user][creatorId][$eq]=${superId}` : 'wholesaler'}`;
        var textFilter = '';
        if (text.length > 0) {
            textFilter = `&filters[fullName][$containsi]=${text}`;
        }
        if (delegateId) {
            delegateFilter = `&filters[visits][user][id][$eq]=${delegateId}`;
        }

        switch (propname) {
            case 'name':
                sortFilter = `&sort[0]=fullName:${order ? 'asc' : 'desc'}`;
                break;
            case 'numVisits':
                sortFilter = `&sort[0]=numVisits:${order ? 'asc' : 'desc'}`;
                break;
            case 'location':
                sortFilter = `&sort[0]=wilaya:${order ? 'asc' : 'desc'}`;
                break;
        }

        var response = await axios.get(`${Globals.apiUrl}/clients?pagination[page]=${page}&pagination[pageSize]=${size}&populate[relatedSpeciality][populate]=domainType${clientTypeFilter}${delegateFilter}${sortFilter}${textFilter}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200 && response.data.data.length > 0) {

            response.data.data.forEach((client: any) => {
                clients.push(ClientModel.fromJson(client))
            });
        }

        return { clients: clients, total: response.data.meta.pagination.total };
    }

}