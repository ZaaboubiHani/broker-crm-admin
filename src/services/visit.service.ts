import axios from "axios";
import VisitModel from "../models/visit.model";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";



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
    
    async getAllVisitsOfDelegate(date: Date,userId:number): Promise<VisitModel[]> {
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
    async getAllVisitsOfDelegateDay(date: Date,userId:number): Promise<VisitModel[]> {
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