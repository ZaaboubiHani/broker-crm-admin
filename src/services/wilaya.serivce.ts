
import WilayaModel from "../models/wilaya.model";
import axios, { AxiosResponse } from "axios";
import Globals from "../api/globals";

export default class WilayaService {

    private static _instance: WilayaService | null = null;

    private constructor() {
    }
  
    static getInstance(): WilayaService {
      if (!WilayaService._instance) {
        WilayaService._instance = new WilayaService();
      }
      return WilayaService._instance;
    }

    async getAllWilayas(): Promise<WilayaModel[]> {
        const response = await fetch("/data/wilayas.json");
        const data = await response.json();
        if(response.ok){
            const uniqueWilayas = Array.from(new Set(data.map((item:any) => item.wilaya)));
            var wilayas : WilayaModel[] = [];
            for(var wilayaName of uniqueWilayas){
                var wilaya = new WilayaModel();
                wilaya.name = wilayaName as string;
                wilaya.communes = data
                .filter((item:any) => item.wilaya === wilayaName)
                .map((item:any) => item.commune);
                wilayas.push(wilaya);
            }
            return wilayas;
        }
        return [];
    }

    async getAllWilayasFromServer(): Promise<WilayaModel[]> {
        const token = localStorage.getItem('token');
        const response = await fetch("/data/wilayas.json");
        const data = await response.json();
        if(response.ok){
            const uniqueWilayas = Array.from(new Set(data.map((item:any) => item.wilaya)));
            var wilayas : WilayaModel[] = [];
            for(var wilayaName of uniqueWilayas){
                var wilaya = new WilayaModel();
                wilaya.name = wilayaName as string;
                wilaya.communes = data
                .filter((item:any) => item.wilaya === wilayaName)
                .map((item:any) => item.commune);
                wilayas.push(wilaya);
            }

            var wilayaResponse = await axios.get(`${Globals.apiUrl}/wilayas?pagination[pageSize]=100`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            for(let wilaya of wilayas){
                for(let serverWilaya of wilayaResponse.data.data){
                    if(wilaya.name?.toLowerCase() === serverWilaya.attributes.nameFr.toLowerCase()){
                        wilaya.id = serverWilaya.id;
                    }
                }
            }

            return wilayas;
        }
        return [];
    }
}