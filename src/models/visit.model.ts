import ClientModel from "./client.model";
import CommandModel from "./command.model";
import ReportModel from "./report.model";
import UserModel from "./user.model";

export default class VisitModel {
    id?: number;
    reference?: string;
    visitLocation?: string;
    hasCommand?: boolean;
    createdDate?: Date;
    client?: ClientModel;
    report?: ReportModel;
    command?: CommandModel;
    user?: UserModel;

    constructor(params: {
        id?: number,
        reference?: string,
        visitLocation?: string,
        hasCommand?: boolean,
        createdDate?: Date,
        client?: ClientModel,
        report?: ReportModel,
        command?: CommandModel,
        user?: UserModel,
    }
    ) {
        this.id = params.id;
        this.reference = params.reference;
        this.visitLocation = params.visitLocation;
        this.hasCommand = params.hasCommand;
        this.createdDate = params.createdDate;
        this.client = params.client;
        this.report = params.report;
        this.command = params.command;
        this.user = params.user;
    }

    static fromJson(json: any): VisitModel {

        var parsedDate  = new Date();

        if (json?.attributes?.createdDate !== null && json?.attributes?.createdDate !== undefined) {
            const timestamp = Date.parse(json.attributes.createdDate);
            parsedDate = new Date(timestamp);
        }

        return new VisitModel({
            id: json.id,
            reference: json.attributes.reference,
            visitLocation: json.attributes.visitLocation,
            hasCommand: json.attributes.hasCommand,
            createdDate:  parsedDate,
            client: json?.attributes?.client?.data !== null && json?.attributes?.client?.data !== undefined ? ClientModel.fromJson(json.attributes.client.data) : undefined,
            user: json?.attributes?.user?.data !== null && json?.attributes?.user?.data !== undefined ? UserModel.fromJson(json.attributes.user.data) : undefined,
        });
    }
}