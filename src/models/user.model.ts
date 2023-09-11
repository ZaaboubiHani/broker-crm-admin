import Company from "./company.model";
import WilayaModel from "./wilaya.model";

export enum UserType {
    admin = 1,
    supervisor = 2,
    delegate = 3,
    kam = 4,
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
        this.creatorId = params?.creatorId;
    }

    static fromJson(json: any): UserModel {
        var wilayas: WilayaModel[] = [];
        if (json?.wilayaActivity?.wilayas) {
            for (var i = 0; i < json?.wilayaActivity.wilayas.length ; i ++) {
               
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
            type: json?.relatedType?.id === 1 ? UserType.admin : json?.relatedType?.id === 2 ? UserType.supervisor : json?.relatedType?.id === 3 ? UserType.delegate : UserType.kam,
            createdAt: new Date(json?.createdAt || json?.attributes?.createdAt),
            isBlocked: json?.blocked || json?.attributes?.blocked,
            wilayas: wilayas,
            creatorId: json.creatorId,
            company: json.company != null && json.company != undefined ? Company.fromJson(json.company) : undefined
        });
    }
}

export default UserModel;

