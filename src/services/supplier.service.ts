import axios from "axios";
import SupplierModel from "../models/supplier.model";
import Globals from "../api/globals";

export default class SupplierService {
    private static _instance: SupplierService | null = null;

    private constructor() {
    }

    static getInstance(): SupplierService {
        if (!SupplierService._instance) {
            SupplierService._instance = new SupplierService();
        }
        return SupplierService._instance;
    }

    async getAllSuppliers(): Promise<SupplierModel[]> {
        const token = localStorage.getItem('token');
        var suppliers: SupplierModel[] = [];
        let page = 1;
        while (true) {
            var response = await axios.get(`${Globals.apiUrl}/company-suppliers?pagination[pageSize]=100&pagination[page]=${page}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            if (response.status == 200) {
                for (let index = 0; index < response.data.data.length; index++) {
                    var supplier = SupplierModel.fromJson(response.data.data[index]);
                    suppliers.push(supplier);
                }
            }
            if (response.data.data.length === 0) {
                break;
            }
            page++;
        }
        return suppliers;

    }

    async getSuppliersPaginated(page: number, size: number,): Promise<{ suppliers: SupplierModel[], total: number }> {
        const token = localStorage.getItem('token');
        var suppliers: SupplierModel[] = [];

        var response = await axios.get(`${Globals.apiUrl}/company-suppliers?pagination[pageSize]=${size}&pagination[page]=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            for (let index = 0; index < response.data.data.length; index++) {
                var supplier = SupplierModel.fromJson(response.data.data[index]);
                suppliers.push(supplier);
            }
        }
        return { suppliers: suppliers, total: response.data.meta.pagination.total };
    }

    async getAllDraftedSuppliers(): Promise<SupplierModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-suppliers?publicationState=preview&filters[publishedAt][$null]=true`,
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
    async publishSupplier(supplierId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-suppliers/${supplierId}`,
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