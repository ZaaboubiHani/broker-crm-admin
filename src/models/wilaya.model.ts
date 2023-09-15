export default class WilayaModel {
    id?: number;
    name?: string;
    communes?: string[];

    constructor(params?: {
        id?: number,
        name?: string
    }) {
        this.id = params?.id;
        this.name = params?.name;
    }

    static fromJson(json: any): WilayaModel {
        return new WilayaModel(
            {
                id: json.id,
                name: json.nameFr,
            }
        );
    }

}