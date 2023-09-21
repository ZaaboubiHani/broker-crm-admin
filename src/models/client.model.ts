export enum ClientType {
    doctor=0,
    pharmacy=1,
    wholesaler=2,
}

export default class ClientModel{
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    phoneOne?: string;
    wilaya?: string;
    commune?: string;
    speciality?: string;
    potential?: number;
    totalSellers?: number;
    totalPostChifa?: number;
    type?: ClientType;


    constructor(params: ClientModel
    ) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
        this.phoneOne = params.phoneOne;
        this.wilaya = params.wilaya;
        this.commune = params.commune;
        this.speciality = params.speciality;
        this.potential = params.potential;
        this.totalPostChifa = params.totalPostChifa;
        this.totalSellers = params.totalSellers;
        this.type = params.type;
    }

    static fromJson(json: any): ClientModel {
        return new ClientModel({
            id: json?.id,
            name: json?.attributes?.fullName,
            email: json?.attributes?.email,
            phoneOne: json?.attributes?.phoneNumberOne,
            wilaya: json?.attributes?.wilaya,
            commune: json?.attributes?.commun,
            speciality: json?.attributes?.relatedSpeciality?.data?.attributes?.name,
            potential: json?.attributes?.potential,
            totalSellers: json?.attributes?.totalSellers,
            totalPostChifa: json?.attributes?.totalPostChifa,
            type: json?.attributes?.relatedSpeciality?.data?.id === 1 ? ClientType.pharmacy : json?.attributes?.relatedSpeciality?.data?.id === 2 ? ClientType.wholesaler : ClientType.doctor,
        });
    }
}