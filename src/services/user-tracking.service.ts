import axios from "axios";
import Globals from "../api/globals";
import { formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";
import UserTrackingModel from "../models/user-tracking.model";




export default class UserTrackingService {
    private static _instance: UserTrackingService | null = null;

    private constructor() {
    }

    static getInstance(): UserTrackingService {
        if (!UserTrackingService._instance) {
            UserTrackingService._instance = new UserTrackingService();
        }
        return UserTrackingService._instance;
    }

    async getUserTrackingByDate(date: Date, userId: number): Promise<UserTrackingModel[]> {
        try {
            const token = localStorage.getItem('token');
            let uerTrackings: UserTrackingModel[] = [];
            let page = 1;
            while (true) {
                var response = await axios.get(`${Globals.apiUrl}/user-trackings?filters[user][id][$eq]=${userId}&filters[createdAt][$containsi]=${formatDateToYYYYMMDD(date)}&pagination[pageSize]=100&pagination[page]=${page}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status == 200) {
                    for (let index = 0; index < response.data['data'].length; index++) {
                        var userTracking = UserTrackingModel.fromJson(response.data['data'][index]);
                        uerTrackings.push(userTracking);
                    }
                }
                if(response.data['data'].length === 0){
                    break;
                }
                page++;
            }
            return uerTrackings;
        } catch (error) {
            return [];
        }

    }

}