export default class ExpenseModel {
    id?: number;
    reference?: string;
    startLocation?: string;
    endLocation?: string;
    totalVisitsDoctor?: number;
    totalVisitsPharmacy?: number;
    totalVisitsWholesaler?: number;
    kmTotal?: number;
    indemnityKm?: number;
    nightsTotal?: number;
    indemnityNights?: number;
    otherExpenses?: number;
    totalExpense?: number;
    createdDate?: Date;

    constructor(data?:ExpenseModel) {
        this.id = data?.id;
        this.reference = data?.reference;
        this.startLocation = data?.startLocation;
        this.endLocation = data?.endLocation;
        this.totalVisitsDoctor = data?.totalVisitsDoctor;
        this.totalVisitsPharmacy = data?.totalVisitsPharmacy;
        this.totalVisitsWholesaler = data?.totalVisitsWholesaler;
        this.kmTotal = data?.kmTotal;
        this.indemnityKm = data?.indemnityKm;
        this.nightsTotal = data?.nightsTotal;
        this.indemnityNights = data?.indemnityNights;
        this.otherExpenses = data?.otherExpenses;
        this.totalExpense = data?.totalExpense;
        this.createdDate = data?.createdDate;
    }

    static fromJson(json: any): ExpenseModel {
        return new ExpenseModel({
            id: json.id,
            reference: json.attributes.reference,
            startLocation: json.attributes.startLocation,
            endLocation: json.attributes.endLocation,
            totalVisitsDoctor: json.attributes.totalVisitsDoctor,
            totalVisitsPharmacy: json.attributes.totalVisitsPharmacy,
            totalVisitsWholesaler: json.attributes.totalVisitsWholesaler,
            kmTotal: json.attributes.kmTotal,
            indemnityKm: json.attributes.indemnityKm,
            nightsTotal: json.attributes.nightsTotal,
            indemnityNights: json.attributes.indemnityNights,
            otherExpenses: json.attributes.otherExpenses,
            totalExpense: json.attributes.totalExpense,
            createdDate: json?.attributes?.createdDate ? new Date(json.attributes.createdDate) : undefined,
        });
    }
    
}
