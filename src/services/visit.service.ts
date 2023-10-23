import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import { ClientType } from "../models/client.model";

export default class VisitService {

    async getAllVisits(date: Date, clientType: ClientType,superId:number): Promise<VisitModel[]> {
        const token = localStorage.getItem('token');

        var typeFilter: string = '';

        if (clientType === ClientType.wholesaler) {
            typeFilter = '&filters[client][relatedSpeciality][domainType][reference][$eq]=wholesaler'
        } else {
            typeFilter = '&filters[client][relatedSpeciality][domainType][reference][$ne]=wholesaler'
        }
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[user][creatorId][$eq]=${superId}&filters[createdDate][$eq]=${formatDateToYYYYMMDD(date)}${typeFilter}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var visits: VisitModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var visit = VisitModel.fromJson(response.data['data'][index]);
                visits.push(visit);
            }
            return visits;
        }
        return [];
    }

    async getAllVisitsMonth(date: Date): Promise<VisitModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user&sort[0]=createdDate:desc`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var visits: VisitModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var visit = VisitModel.fromJson(response.data['data'][index]);
                visits.push(visit);
            }
            return visits;
        }
        return [];
    }

    async getAllVisitsPaginated(page: number, size: number, text: string, clientType: ClientType,superId:number): Promise<{ visits: VisitModel[], total: number }> {
        const token = localStorage.getItem('token');
        var textFilter = '';
        if (text.length > 0) {
            textFilter = `&filters[client][fullName][$containsi]=${text}`;
        }
      
        var response = await axios.get(`${Globals.apiUrl}/visits?populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user${textFilter}&pagination[page]=${page}&pagination[pageSize]=${size}&filters[client][relatedSpeciality][domainType][reference][$eq]=${clientType === ClientType.doctor ? 'doctor' : clientType === ClientType.pharmacy ? 'pharmacy' : 'wholesaler'}&filters[user][creatorId][$eq]=${superId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var visits: VisitModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var visit = VisitModel.fromJson(response.data['data'][index]);
                visits.push(visit);
            }
            return { visits: visits, total: response.data.meta.pagination.total };
        }
        return { visits: [], total: 0 };
    }

    async getAllVisitsOfDelegate(page: number, size: number,date: Date, userId: number): Promise<{ visits: VisitModel[], total: number}> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[user][id][$eq]=${userId}&pagination[page]=${page}&pagination[pageSize]=${size}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&sort[0]=createdDate:desc&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var visits: VisitModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var visit = VisitModel.fromJson(response.data['data'][index]);
                visits.push(visit);
            }
            return { visits: visits, total: response.data.meta.pagination.total };
        }
        return{ visits: [], total: 0 };
    }
    async getAllVisitsOfDelegateDay(date: Date, userId: number): Promise<VisitModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMMDD(date)}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200) {
            var visits: VisitModel[] = [];
            for (let index = 0; index < response.data['data'].length; index++) {
                var visit = VisitModel.fromJson(response.data['data'][index]);
                visits.push(visit);
            }
            return visits;
        }
        return [];
    }

}