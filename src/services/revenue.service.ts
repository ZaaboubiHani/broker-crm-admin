import axios from "axios";
import RevenueModel from "../models/revenue.model";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMMDD } from "../functions/date-format";



export default class RevenueService {

    async getAllRevenuesMonth(date: Date): Promise<RevenueModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/classementChiffreDaffaireEquipe?supervisor=2&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200 && response.data.finalArray.length > 0) {
            var result:RevenueModel[] = [];
            response.data.finalArray.forEach((rev:any) => {
                result.push(RevenueModel.fromJson(rev))
            });
            return result;
        }
        return [];
    }

}