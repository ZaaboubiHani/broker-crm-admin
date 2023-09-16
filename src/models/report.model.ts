import ClientModel from "./client.model";
import CommentModel from "./comment.model";
import ProductModel from "./product.model";
import SupplierModel from "./supplier.model";

export default class ReportModel {
    id?: number;
    note?: string;
    products?: ProductModel[];
    coproducts?: ProductModel[];
    suppliers?: SupplierModel[];
    comments?: CommentModel[];
    objectif?: string;
    dejaClient?: boolean;


    constructor(data?: ReportModel) {
        if (data) {
            this.id = data.id;
            this.note = data.note;
            this.products = data.products ? [...data.products] : [];
            this.coproducts = data.coproducts ? [...data.coproducts] : [];
            this.suppliers = data.suppliers ? [...data.suppliers] : [];
            this.comments = data.comments ? [...data.comments] : [];
            this.objectif = data.objectif;
            this.dejaClient = data.dejaClient;
        } else {
            this.products = [];
            this.coproducts = [];
            this.suppliers = [];
            this.comments = [];
        }
    }

    static fromJson(json: any): ReportModel {
        const report = new ReportModel();
        report.id = json.id;
        report.note = json.attributes.note;
        report.objectif = json.attributes.objectif;
        report.dejaClient = json.attributes.dejaClient;
        
        if (json?.attributes?.products?.data) {
            report.products = json.attributes.products.data.map((productData: any) => {
                var product = ProductModel.fromJson(productData.attributes.product.data);
                product.quantity = productData.attributes.quantity;
                product.rotations = productData.attributes.rotations;
                return product;
            });
        }
        
        if (json?.attributes?.coproducts?.data?.length > 0) {
            report.coproducts = json.attributes.coproducts.data.map((coproductData: any) => {
                var product = ProductModel.fromJson(coproductData.attributes.coproduct.data);
                product.quantity = coproductData.attributes.quantity;
                product.rotations = coproductData.attributes.rotations;
                return product;
            });
        }

        if (json?.attributes?.suppliers?.data) {
            report.suppliers = json.attributes.suppliers.data.map((supplierData: any) => SupplierModel.fromJson(supplierData.attributes.supplier.data));
        }
        
        if (json?.attributes?.comments?.data) {
            report.comments = json.attributes.comments.data.map((commentData: any) => CommentModel.fromJson(commentData?.attributes?.comment?.data));
        }
        
        return report;
    }
}