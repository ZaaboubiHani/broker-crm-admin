export enum CompanyType {
    laboratory = 1,
    wholesale = 2,
}

class CompanyModel {
    id?: number;
    name?: string;
    brand?: string;
    rc?: string;
    nif?: string;
    nic?: string;
    phoneOne?: string;
    phoneTwo?: string;
    email?: string;
    address?: string;
    wilaya?: string;
    commun?: string;
    type?: CompanyType;


    constructor(params: {
        id?: number;
        name?: string;
        brand?: string;
        rc?: string;
        nif?: string;
        nic?: string;
        phoneOne?: string;
        phoneTwo?: string;
        email?: string;
        address?: string;
        wilaya?: string;
        commun?: string;
        type?: CompanyType;
    }) {
        this.id = params.id;
        this.name = params.name;
        this.brand = params.brand;
        this.rc = params.rc;
        this.nif = params.nif;
        this.nic = params.nic;
        this.phoneOne = params.phoneOne;
        this.phoneTwo = params.phoneTwo;
        this.email = params.email;
        this.address = params.address;
        this.wilaya = params.wilaya;
        this.commun = params.commun;
        this.type = params.type;
    }

    static fromJson(json: any): CompanyModel {
        return new CompanyModel({
            id: json.id,
            name: json.name,
            brand: json.brand,
            rc: json.rc,
            nif: json.nif,
            nic: json.nic,
            phoneOne: json.phoneOne,
            phoneTwo: json.phoneTwo,
            email: json.email,
            address: json.address,
            wilaya: json.wilaya,
            commun: json.commun,
            type: json.type,
        });
    }
}

export default CompanyModel;