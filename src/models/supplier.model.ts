export default class SupplierModel {
    id?: number;
    name?: string;
    wilaya?: string;
    commun?: string;
    email?: string;
    phone01?: string;
    phone02?: string;
    type?: boolean;
  
    constructor({
      id,
      name,
      wilaya,
      commun,
      email,
      phone01,
      phone02,
      type,
    }: {
      id?: number;
      name?: string;
      wilaya?: string;
      commun?: string;
      email?: string;
      phone01?: string;
      phone02?: string;
      type?: boolean;
    }) {
      this.id = id;
      this.name = name;
      this.wilaya = wilaya;
      this.commun = commun;
      this.email = email;
      this.phone01 = phone01;
      this.phone02 = phone02;
      this.type = type;
    }
  
    static fromJson(json: any): SupplierModel {
      return new SupplierModel({
        id: json.id,
        name: json.attributes.name,
        wilaya: json.attributes.wilaya,
        commun: json.attributes.commun,
        email: json.attributes.email,
        phone01: json.attributes.phoneNumberOne,
        phone02: json.attributes.phoneNumberTwo,
        type: json.attributes.type,
      });
    }
  }