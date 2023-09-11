import axios from "axios";
import SpecialityModel from "../models/speciality.model";
import Globals from "../api/globals";

export default class SpecialityService {

    async getAllMedicalSpecialities(): Promise<SpecialityModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/specialities?filters[domainType][id][$eq]=1`,
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
}