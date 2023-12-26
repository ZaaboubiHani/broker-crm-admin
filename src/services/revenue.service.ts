import axios from "axios";
import RevenueModel from "../models/revenue.model";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMMDD } from "../functions/date-format";



export default class RevenueService {
    private static _instance: RevenueService | null = null;

    private constructor() {
    }
  
    static getInstance(): RevenueService {
      if (!RevenueService._instance) {
        RevenueService._instance = new RevenueService();
      }
      return RevenueService._instance;
    }
    async getAllRevenuesMonth(date: Date,superId:number): Promise<RevenueModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/classementChiffreDaffaireEquipe?supervisor=${superId}&year=${formatDateToYYYY(date)}&month=${formatDateToMM(date)}`,
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