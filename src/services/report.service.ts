import axios from "axios";
import ReportModel from "../models/report.model";
import Globals from "../api/globals";
import { formatDateToYYYYMMDD } from "../functions/date-format";



export default class ReportService {

    async getReportOfVisit(visitId: number): Promise<ReportModel> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/rapports?filters[visit][id][$eq]=${visitId}&populate=products.product&populate=coproducts.coproduct&populate=suppliers.supplier&populate=comments.comment`,
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