import UserModel from "./user.model";

export default class GoalModel {
    id?: number;
    goalDate?: Date;
    totalSales?: number;
    totalVisits?: number;
    user?: UserModel;

    constructor(data?:GoalModel) {
        this.id = data?.id;
        this.goalDate = data?.goalDate;
        this.totalSales = data?.totalSales;
        this.totalVisits = data?.totalVisits;
        this.user = data?.user;
    }

    static fromJson(json: any): GoalModel {
        return new GoalModel({
            id: json.id,
            goalDate: new Date(json.attributes.goalDate),
            totalSales: json.attributes.totalVentes,
            totalVisits: json.attributes.totalVisites,
            user: UserModel.fromJson(json.attributes.users_permissions_user.data),

        });
    }
}
