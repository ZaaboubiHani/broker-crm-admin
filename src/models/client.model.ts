export enum ClientType {
    doctor=0,
    pharmacy=1,
    wholesaler=2,
}

export default class ClientModel{
    id?: number;
    name?: string;
    email?: string;
    phoneOne?: string;
    wilaya?: string;
    commune?: string;
    speciality?: string;
    location?: string;
    potential?: number;
    visitsNum?: number;
    totalSellers?: number;
    totalPostChifa?: number;
    sector?: string;
    type?: ClientType;


    constructor(params: ClientModel
    ) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.phoneOne = params.phoneOne;
        this.wilaya = params.wilaya;
        this.location = params.location;
        this.commune = params.commune;
        this.speciality = params.speciality;
        this.potential = params.potential;
        this.totalPostChifa = params.totalPostChifa;
        this.totalSellers = params.totalSellers;
        this.type = params.type;
        this.sector = params.sector;
        this.visitsNum = params.visitsNum;
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
            location: json?.attributes?.localization,
            totalSellers: json?.attributes?.totalSellers,
            totalPostChifa: json?.attributes?.totalPostChifa,
            visitsNum: json?.attributes?.visits?.data?.length,
            sector: json?.attributes?.sector === undefined || json?.attributes?.sector === null ? undefined : json?.attributes?.sector === true ? 'etatique' : 'privé',
            type: json?.attributes?.relatedSpeciality?.data?.id === 1 ? ClientType.pharmacy : json?.attributes?.relatedSpeciality?.data?.id === 2 ? ClientType.wholesaler : ClientType.doctor,
        });
    }
}