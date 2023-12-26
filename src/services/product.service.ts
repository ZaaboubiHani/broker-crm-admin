import axios from "axios";
import ProductModel from "../models/product.model";
import Globals from "../api/globals";

export default class ProductService {
    private static _instance: ProductService | null = null;

    private constructor() {
    }
  
    static getInstance(): ProductService {
      if (!ProductService._instance) {
        ProductService._instance = new ProductService();
      }
      return ProductService._instance;
    }
    async getAllProducts(): Promise<ProductModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-products`,
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

    async getAllCoProducts(): Promise<ProductModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-coproducts`,
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
        var response = await axios.get(`${Globals.apiUrl}/company-products?publicationState=preview&filters[publishedAt][$null]=true`,
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
    async getAllDraftedCoProducts(): Promise<ProductModel[]> {
        const token = localStorage.getItem('token');
        var response = await axios.get(`${Globals.apiUrl}/company-coproducts?publicationState=preview&filters[publishedAt][$null]=true`,
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
                    PPA: product.ppa,
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

    async createCoProduct(product: ProductModel): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.post(`${Globals.apiUrl}/company-coproducts`,
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
    async draftCoProduct(productId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-coproducts/${productId}`,
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
    async publishCoProduct(productId: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        var response = await axios.put(`${Globals.apiUrl}/company-coproducts/${productId}`,
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