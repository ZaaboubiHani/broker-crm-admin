import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import { ClientType } from "../models/client.model";

export default class VisitService {
    private static _instance: VisitService | null = null;

    private constructor() {
    }

    static getInstance(): VisitService {
        if (!VisitService._instance) {
            VisitService._instance = new VisitService();
        }
        return VisitService._instance;
    }


    async getAllVisits(page: number, size: number, date: Date, clientType: ClientType, superId: number, order: boolean, propname?: string): Promise<{ visits: VisitModel[], total: number }> {
        const token = localStorage.getItem('token');

        var typeFilter: string = '';
        var creatorFilter: string = '';

        if (clientType === ClientType.wholesaler) {
            typeFilter = '&filters[client][relatedSpeciality][domainType][reference][$eq]=wholesaler'
        } else {
            typeFilter = '&filters[client][relatedSpeciality][domainType][reference][$ne]=wholesaler'
            creatorFilter = superId !== 0 ? `filters[user][creatorId][$eq]=${superId}&` : '';
        }

        var textSort = '';

        if (propname) {
            switch (propname) {
                case 'client':
                    textSort = `&sort[0]=client.fullName:${order ? 'asc' : 'desc'}`;
                    break;
                case 'username':
                    textSort = `&sort[0]=user.username:${order ? 'asc' : 'desc'}`;
                    break;
                case 'location':
                    textSort = `&sort[0]=client.wilaya:${order ? 'asc' : 'desc'}`;
                    break;
                case 'speciality':
                    textSort = `&sort[0]=client.relatedSpeciality.domainType.reference:${order ? 'asc' : 'desc'}`;
                    break;
            }
        }

        var response = await axios.get(`${Globals.apiUrl}/visits?${creatorFilter}pagination[page]=${page}&pagination[pageSize]=${size}${textSort}&filters[createdDate][$eq]=${formatDateToYYYYMMDD(date)}${typeFilter}&populate[rapport][populate]=*&populate[client][populate]=relatedSpeciality.domainType&populate=user&sort[1]=createdDate:desc`,
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

    async getAllVisitsPaginated(clientId: number, superId: number, delegateId?: number,): Promise<{ visits: VisitModel[], total: number }> {
        const token = localStorage.getItem('token');
        var delegateFilter = '';
        var visits: VisitModel[] = [];
        let page = 1;
        let total = 0;
        var clientFilter = `&filters[client][id][$eq]=${clientId}`;

        if (superId !== 0) {
            if (delegateId) {
                delegateFilter = `&filters[user][id][$eq]=${delegateId}`;
            }
            else {
                delegateFilter = `&filters[user][creatorId][$eq]=${superId}`;
            }
        }

        while (true) {

            var response = await axios.get(`${Globals.apiUrl}/visits?populate=user&pagination[page]=${page}&pagination[pageSize]=100${delegateFilter}${clientFilter}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

            if (response.status == 200) {

                for (let index = 0; index < response.data['data'].length; index++) {
                    var visit = VisitModel.fromJson(response.data['data'][index]);
                    visits.push(visit);
                }
                total = response.data.meta.pagination.total;
            }
            page++;
            if (response.data.data.length === 0) {
                break;
            }
        }

        return { visits: visits, total: total };
    }

    async getAllVisitsOfDelegate(page: number, size: number, date: Date, userId: number): Promise<{ visits: VisitModel[], total: number }> {
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
        return { visits: [], total: 0 };
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