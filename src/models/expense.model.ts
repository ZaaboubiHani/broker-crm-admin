import FileModel from "./file.model";

export default class ExpenseModel {
    id?: number;
    reference?: string;
    startWilaya?: string;
    endWilaya?: string;
    startCommun?: string;
    endCommun?: string;
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
    proofs?: FileModel[];

    constructor(data?: ExpenseModel) {
        this.id = data?.id;
        this.reference = data?.reference;
        this.startWilaya = data?.startWilaya;
        this.endWilaya = data?.endWilaya;
        this.startCommun = data?.startCommun;
        this.endCommun = data?.endCommun;
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
        this.proofs = data?.proofs;
    }

    static fromJson(json: any): ExpenseModel {
        var proofs: FileModel[] = [];
        if (json?.attributes?.proofs?.data) {
            proofs = json?.attributes?.proofs?.data.map((invoice: any) => FileModel.fromJson(invoice));
        }
        return new ExpenseModel({
            id: json.id,
            reference: json.attributes.reference,
            startWilaya: json.attributes.startWilaya,
            endWilaya: json.attributes.endWilaya,
            startCommun: json.attributes.startCommun,
            endCommun: json.attributes.endCommun,
            totalVisitsDoctor: json.attributes.totalVisitsDoctor,
            totalVisitsPharmacy: json.attributes.totalVisitsPharmacy,
            totalVisitsWholesaler: json.attributes.totalVisitsWholesaler,
            kmTotal: json.attributes.kmTotal,
            indemnityKm: json.attributes.indemnityKm,
            nightsTotal: json.attributes.nightsTotal,
            indemnityNights: json.attributes.indemnityNights,
            otherExpenses: json.attributes.otherExpenses,
            totalExpense: json.attributes.totalExpense,
            proofs: proofs,
            createdDate: json?.attributes?.createdDate ? new Date(json.attributes.createdDate) : undefined,
        });
    }

}
