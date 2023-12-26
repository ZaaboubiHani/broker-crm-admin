import axios from "axios";
import SpecialityModel from "../models/speciality.model";
import Globals from "../api/globals";

export default class SpecialityService {
    private static _instance: SpecialityService | null = null;

    private constructor() {
    }
  
    static getInstance(): SpecialityService {
      if (!SpecialityService._instance) {
        SpecialityService._instance = new SpecialityService();
      }
      return SpecialityService._instance;
    }
    async getAllMedicalSpecialities(page: number, size: number,): Promise<{ specialities: SpecialityModel[], total: number }> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/specialities?filters[domainType][id][$eq]=1&pagination[page]=${page}&pagination[pageSize]=${size}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var specialities: SpecialityModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var speciality = SpecialityModel.fromJson(response.data.data[index]);
                specialities.push(speciality);
            }
            return { specialities: specialities, total: response.data.meta.pagination.total };;
        }
        return { specialities: [], total: 0 };
    }

    async getAllDraftedMedicalSpecialities(): Promise<SpecialityModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/specialities?filters[domainType][id][$eq]=1&publicationState=preview&filters[publishedAt][$null]=true`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var specialitys: SpecialityModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var speciality = SpecialityModel.fromJson(response.data.data[index]);
                specialitys.push(speciality);
            }
            return specialitys;
        }
        return [];
    }

    async createMedicalSpeciality(name: string): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/specialities`,
            {
                data: {
                    name: `${name}`,
                    domainType: 1
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

    async draftMedicalSpeciality(specialityId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/specialities/${specialityId}`,
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

    async publishMedicalSpeciality(specialityId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/specialities/${specialityId}`,
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