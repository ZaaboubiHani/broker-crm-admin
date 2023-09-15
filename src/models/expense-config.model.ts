export default class ExpenseConfigModel {
    id?: number;
    reference?: string;
    kmPrice?: number;
    nightPrice?: number;

    constructor(data?:ExpenseConfigModel) {
        this.id = data?.id;
        this.reference = data?.reference;
        this.kmPrice = data?.kmPrice;
        this.nightPrice = data?.nightPrice;
    }

    static fromJson(json: any): ExpenseConfigModel {
        return new ExpenseConfigModel({
            id: json.id,
            reference: json.attributes.reference,
            nightPrice: json.attributes.nightPrice,
            kmPrice: json.attributes.kmPrice,
        });
    }
    
}
