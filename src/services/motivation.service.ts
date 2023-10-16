import axios from "axios";
import MotivationModel from "../models/motivation.model";
import Globals from "../api/globals";

export default class MotivationService {

    async getAllMotivations(): Promise<MotivationModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-motivations?filters[domainType][id][$eq]=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var motivations: MotivationModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var motivation = MotivationModel.fromJson(response.data.data[index]);
                motivations.push(motivation);
            }
            return motivations;
        }
        return [];
    }
    async getAllDraftedMotivations(): Promise<MotivationModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-motivations?filters[domainType][id][$eq]=1&publicationState=preview&filters[publishedAt][$null]=true`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var motivations: MotivationModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var motivation = MotivationModel.fromJson(response.data.data[index]);
                motivations.push(motivation);
            }
            return motivations;
        }
        return [];
    }

    async createMotivation(content: string): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/company-motivations`,
            {
                data: {
                    content: `${content}`,
                    company: 1
                }
            },
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

    async draftMotivation(motivationId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-motivations/${motivationId}`,
            {
                data: {
                    publishedAt: null
                }
            },
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

    async publishMotivation(motivationId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-motivations/${motivationId}`,
            {
                data: {
                    publishedAt: new Date()
                }
            },
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