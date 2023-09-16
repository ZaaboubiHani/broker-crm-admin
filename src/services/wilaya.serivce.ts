
import WilayaModel from "../models/wilaya.model";


export default class WilayaService {

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
}