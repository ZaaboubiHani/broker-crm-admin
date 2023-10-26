import ClientModel from "./client.model";
import CommentModel from "./comment.model";
import FileModel from "./file.model";
import MotivationModel from "./motivation.model";
import ProductModel from "./product.model";
import SupplierModel from "./supplier.model";
import VisitModel from "./visit.model";

export default class CommandModel {
    id?: number;
    hasMotivation?: boolean;
    isHonored?: boolean;
    total?: number;
    remise?: number;
    totalRemised?: number;
    note?: string;
    visit?: VisitModel;
    products?: ProductModel[];
    motivations?: MotivationModel[];
    suppliers?: SupplierModel[];
    finalSupplier?: SupplierModel;
    signature?: FileModel;
    invoice?: FileModel;


    constructor(data?: CommandModel) {
        if (data) {
            this.id = data.id;
            this.products = data.products ? [...data.products] : [];
            this.suppliers = data.suppliers ? [...data.suppliers] : [];
            this.motivations = data.motivations ? [...data.motivations] : [];
            this.visit = data.visit;
            this.hasMotivation = data.hasMotivation;
            this.isHonored = data.isHonored;
            this.total = data.total;
            this.remise = data.remise;
            this.totalRemised = data.totalRemised;
            this.note = data.note;
        } else {
            this.products = [];
            this.suppliers = [];
            this.motivations = [];
        }
    }

    static fromJson(json: any): CommandModel {
        const command = new CommandModel();
        command.id = json.id;
        command.hasMotivation = json.attributes.hasMotivation;
        command.isHonored = json.attributes.isHonored;
        command.total = json.attributes.total;
        command.remise = json.attributes.remise;
        command.totalRemised = json.attributes.totalRemised;
        command.note = json.attributes.note;

        if (json?.attributes?.signature?.data) {
            command.signature = FileModel.fromJson(json?.attributes?.signature?.data);
        }

        if (json?.attributes?.invoice?.data) {
            command.invoice = FileModel.fromJson(json?.attributes?.invoice?.data[0]);
        }

        if (json.attributes.products.data) {
            command.products = json.attributes.products.data.map((productData: any) => {
                var product = ProductModel.fromJson(productData.attributes.product.data);
                product.quantity = productData.attributes.quantity;
                product.rotations = productData.attributes.rotations;
                return product;
            });
        }

        if (json.attributes.suppliers.data) {
            command.suppliers = json.attributes.suppliers.data.map((supplierData: any) => SupplierModel.fromJson(supplierData));
        }

        if (json.attributes.motivations.data) {
            command.motivations = json.attributes.motivations.data.map((motivationData: any) => MotivationModel.fromJson(motivationData));
        }


        if (json?.attributes?.visit?.data) {
            command.visit = VisitModel.fromJson(json?.attributes?.visit?.data);
        }

        if (json?.attributes?.commandSupplier?.data?.attributes?.supplier?.data) {
            command.finalSupplier = SupplierModel.fromJson(json?.attributes?.commandSupplier?.data?.attributes?.supplier?.data);
        }

        return command;
    }
}