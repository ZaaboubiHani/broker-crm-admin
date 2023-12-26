import axios from "axios";
import ReportModel from "../models/report.model";
import Globals from "../api/globals";
import { formatDateToMM, formatDateToYYYY, formatDateToYYYYMM, formatDateToYYYYMMDD } from "../functions/date-format";

export default class ReportService {
    private static _instance: ReportService | null = null;

    private constructor() {
    }
  
    static getInstance(): ReportService {
      if (!ReportService._instance) {
        ReportService._instance = new ReportService();
      }
      return ReportService._instance;
    }
    async getReportOfVisit(visitId: number): Promise<ReportModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/rapports?publicationState=preview&filters[visit][id][$eq]=${visitId}&populate=products.product&populate=coproducts.coproduct&populate=suppliers.supplier&populate=comments.comment`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200 && response.data.data.length > 0) {
            var report = ReportModel.fromJson(response.data['data'][0]);
            return report;
        }
        return new ReportModel();
    }

    async getReportOfClient(clientId: number,date:Date): Promise<ReportModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/rapports?publicationState=preview&filters[visit][client][id][$eq]=${clientId}&filters[visit][createdDate][$lte]=${formatDateToYYYYMMDD(date)}&filters[visit][createdDate][$gte]=${formatDateToYYYYMMDD(date)}&populate=products.product&populate=coproducts.coproduct&populate=suppliers.supplier&populate=comments.comment`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (response.status == 200 && response.data.data.length > 0) {
            var report = ReportModel.fromJson(response.data['data'][0]);
            return report;
        }
        return new ReportModel();
    }

}