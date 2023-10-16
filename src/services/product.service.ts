import axios from "axios";
import ProductModel from "../models/product.model";
import Globals from "../api/globals";

export default class ProductService {

    async getAllProducts(): Promise<ProductModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-products?filters[domainType][id][$eq]=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var products: ProductModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var product = ProductModel.fromJson(response.data.data[index]);
                products.push(product);
            }
            return products;
        }
        return [];
    }
    async getAllDraftedProducts(): Promise<ProductModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-products?filters[domainType][id][$eq]=1&publicationState=preview&filters[publishedAt][$null]=true`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        if (response.status == 200) {
            var products: ProductModel[] = [];
            for (let index = 0; index < response.data.data.length; index++) {
                var product = ProductModel.fromJson(response.data.data[index]);
                products.push(product);
            }
            return products;
        }
        return [];
    }

    async createProduct(product: ProductModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/company-products`,
            {
                data: {
                    name: product.name,
                    ug: product.ug,
                    remise: product.remise,
                    grossistPriceUnit: product.wholesalePriceUnit,
                    pharmacyPriceUnit: product.pharmacyPriceUnit,
                    superGrossistPriceUnit: product.superWholesalePriceUnit,
                    collisage: product.collision,
                    DDP: product.ddp,
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
    async draftProduct(productId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-products/${productId}`,
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
    async publishProduct(productId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-products/${productId}`,
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