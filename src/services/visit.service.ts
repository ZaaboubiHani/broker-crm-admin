import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import { ClientType } from "../models/client.model";

export default class VisitService {

    async getAllVisits(date: Date): Promise<VisitModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[createdDate][$eq]=${formatDateToYYYYMMDD(date)}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user`,
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

    async getAllVisitsPaginated(page: number, size: number, text: string,clientType:ClientType): Promise<{ visits: VisitModel[], total: number }> {
        const token = localStorage.getItem('token');
        var textFilter = '';
        if (text.length > 0) {
            textFilter = `&filters[client][fullName][$containsi]=${text}`;
        }
        var id = localStorage.getItem('id');
        var response = await axios.get(`${Globals.apiUrl}/visits?populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user${textFilter}&pagination[page]=${page}&pagination[pageSize]=${size}&filters[client][relatedSpeciality][domainType][id][$eq]=${clientType === ClientType.doctor ? 1 : clientType === ClientType.pharmacy ? 2 : 3 }&filters[user][creatorId][$eq]=${id}`,
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

    async getAllVisitsOfDelegate(date: Date, userId: number): Promise<VisitModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/visits?filters[user][id][$eq]=${userId}&filters[createdDate][$containsi]=${formatDateToYYYYMM(date)}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user`,
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