
export default class ProductModel {
  id?: number;
  name?: string;
  ug?: number;
  remise?: number;
  pharmacyPriceUnit?: number;
  wholesalePriceUnit?: number;
  superWholesalePriceUnit?: number;
  collision?: number;
  ddp?: Date | null;
  quantity?: number;
  rotations?: number;

  constructor(params: {
    id?: number;
    name?: string;
    ug?: number;
    remise?: number;
    pharmacyPriceUnit?: number;
    wholesalePriceUnit?: number;
    superWholesalePriceUnit?: number;
    collision?: number;
    ddp?: Date | null;
    quantity?: number;
    rotations?: number;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.remise = params.remise;
    this.ug = params.ug;
    this.pharmacyPriceUnit = params.pharmacyPriceUnit;
    this.superWholesalePriceUnit = params.superWholesalePriceUnit;
    this.wholesalePriceUnit = params.wholesalePriceUnit;
    this.collision = params.collision;
    this.ddp = params.ddp;
    this.quantity = params.quantity;
    this.rotations = params.rotations;
  }



  static fromJson(json: any): ProductModel {
    return new ProductModel({
      id: json.id,
      name: json.attributes.name,
      ug: json.attributes.ug,
      remise: json.attributes.remise,
      pharmacyPriceUnit:
        json.attributes.pharmacyPriceUnit,
      wholesalePriceUnit:
        json.attributes.grossistPriceUnit,
      superWholesalePriceUnit:
        json.attributes.superGrossistPriceUnit,
      collision: json.attributes.collisage,
      ddp: json.attributes.DDP ? new Date(json.attributes.DDP) : null,
      quantity: json.attributes.quantity,
      rotations: json.attributes.rotations,
    });
  }
}