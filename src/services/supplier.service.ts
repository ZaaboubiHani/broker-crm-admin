import axios from "axios";
import SupplierModel from "../models/supplier.model";
import Globals from "../api/globals";

export default class SupplierService {

    async getAllSuppliers(): Promise<SupplierModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-suppliers`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var suppliers: SupplierModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var supplier = SupplierModel.fromJson(response.data.data[index]);
                suppliers.push(supplier);
            }
            return suppliers;
        }
        return [];
    }

    async createSupplier(supplier: SupplierModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/company-suppliers`,
            {
                data: {
                    name: `${supplier.name}`,
                    wilaya: `${supplier.wilaya}`,
                    commun: `${supplier.commun}`,
                    phoneNumberOne: `${supplier.phone01}`,
                    phoneNumberTwo: `${supplier.phone02}`,
                    email: `${supplier.email}`,
                    type: supplier.type
                    
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
    async draftSupplier(supplierId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-suppliers/${supplierId}`,
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
}