export default class RevenueModel {
    delegateId?: number;
    delegateName?: string;
    amount?: number;
    percentage?: number;

    constructor({
        delegateId,
        delegateName,
        amount,
        percentage,

    }: RevenueModel) {
        this.delegateId = delegateId;
        this.delegateName = delegateName;
        this.amount = amount;
        this.percentage = percentage;
    }

    static fromJson(json: any): RevenueModel {
        return new RevenueModel({
            delegateId: json.delegateId,
            delegateName: json.delegateName,
            amount: json.ChiffreDaffaire,
            percentage: json.percentage,
        });
    }
}