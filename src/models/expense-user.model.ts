export default class ExpenseUserModel {
    id?: number;
    reference?: string;
    userValidation?: boolean;
    adminValidation?: boolean;
    total?: number;
    createdDate?: Date;

    constructor(data?:ExpenseUserModel) {
        this.id = data?.id;
        this.reference = data?.reference;
        this.userValidation = data?.userValidation;
        this.adminValidation = data?.adminValidation;
        this.total = data?.total;
        this.createdDate = data?.createdDate;
    }

    static fromJson(json: any): ExpenseUserModel {
        return new ExpenseUserModel({
            id: json.id,
            reference: json.attributes.reference,
            userValidation: json.attributes.userValidation,
            adminValidation: json.attributes.adminValidation,
            total: json.attributes.total,
            createdDate: json?.attributes?.createdDate ? new Date(json.attributes.createdDate) : undefined,
        });
    }
    
}
