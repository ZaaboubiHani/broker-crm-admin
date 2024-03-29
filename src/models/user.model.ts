import Company from "./company.model";
import WilayaModel from "./wilaya.model";

export enum UserType {
    admin = 1,
    supervisor = 2,
    delegate = 3,
    kam = 4,
    operator = 5,
}

class UserModel {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    token?: string;
    phoneOne?: string;
    wilaya?: string;
    commune?: string;
    fcmToken?: string;
    type?: UserType;
    createdAt?: Date;
    isBlocked?: boolean;
    company?: Company;
    creatorId?: number;
    wilayas?: WilayaModel[];

    constructor(params?: {
        id?: number,
        username?: string,
        email?: string,
        password?: string,
        token?: string,
        phoneOne?: string,
        wilaya?: string,
        commune?: string,
        fcmToken?: string,
        type?: UserType,
        createdAt?: Date,
        isBlocked?: boolean,
        company?: Company,
        creatorId?: number,
        wilayas?: WilayaModel[]
    }
    ) {
        this.id = params?.id;
        this.username = params?.username;
        this.email = params?.email;
        this.password = params?.password;
        this.token = params?.token;
        this.phoneOne = params?.phoneOne;
        this.wilaya = params?.wilaya;
        this.commune = params?.commune;
        this.type = params?.type;
        this.createdAt = params?.createdAt;
        this.isBlocked = params?.isBlocked;
        this.company = params?.company;
        this.wilayas = params?.wilayas;
        this.fcmToken = params?.fcmToken;
        this.creatorId = params?.creatorId;
    }

    static fromJson(json: any): UserModel {
        var wilayas: WilayaModel[] = [];
        if (json?.wilayaActivity?.wilayas) {
            for (var i = 0; i < json?.wilayaActivity.wilayas.length; i++) {

                var wilaya = WilayaModel.fromJson(json?.wilayaActivity.wilayas[i]);

                wilayas.push(wilaya);
            }
        }

        return new UserModel({
            id: json.id,
            username: json?.username || json?.attributes?.username,
            email: json?.email || json?.attributes?.email,
            phoneOne: json?.phoneOne || json?.attributes?.phoneOne,
            wilaya: json?.wilaya || json?.attributes?.wilaya,
            commune: json?.commun || json?.attributes?.commun,
            type: json?.relatedType?.reference === 'admin' ? UserType.admin : json?.relatedType?.reference === 'supervisor' ? UserType.supervisor : json?.relatedType?.reference === 'delegate' ? UserType.delegate : json?.relatedType?.reference === 'operator' ? UserType.operator : UserType.kam,
            createdAt: new Date(json?.createdAt || json?.attributes?.createdAt),
            isBlocked: json?.blocked || json?.attributes?.blocked,
            wilayas: wilayas,
            creatorId: json.creatorId,
            fcmToken: json.fcmToken,
            company: json.company != null && json.company != undefined ? Company.fromJson(json.company) : undefined
        });
    }

    clone(): UserModel {
        return new UserModel({
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            token: this.token,
            phoneOne: this.phoneOne,
            wilaya: this.wilaya,
            commune: this.commune,
            type: this.type,
            createdAt: this.createdAt,
            isBlocked: this.isBlocked,
            company: this.company,
            creatorId: this.creatorId,
            wilayas: this.wilayas,
        });
    }
}

export default UserModel;

