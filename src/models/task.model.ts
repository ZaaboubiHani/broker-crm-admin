import ClientModel from "./client.model";
import UserModel from "./user.model";
import VisitModel from "./visit.model";

class TaskDone{
    isDone:boolean = false;
}


export default class TaskModel extends TaskDone{
    id?: number;
    visitDate?: Date;
    client?: ClientModel;
    delegate?: UserModel;
    visit?: VisitModel;

    constructor(params: {
        id?: number,
        visitDate?: Date,
        client?: ClientModel,
        delegate?: UserModel,
    }
    ) {
        super();
        this.id = params.id;
        this.visitDate = params.visitDate;
        this.client = params.client;
        this.delegate = params.delegate;
    }

    static fromJson(json: any): TaskModel {

        var parsedDate = new Date();
        if (json.attributes.visitDate !== null && json.attributes.visitDate !== undefined) {
            const timestamp = Date.parse(json.attributes.visitDate);
            parsedDate = new Date(timestamp);
        }

        return new TaskModel({
            id: json.id,
            visitDate: parsedDate,
            client: json.attributes.client.data !== null && json.attributes.client.data !== undefined ? ClientModel.fromJson(json.attributes.client.data) : undefined,
            delegate: json.attributes.task.data.attributes.delegate.data !== null && json.attributes.task.data.attributes.delegate.data !== undefined ? UserModel.fromJson(json.attributes.task.data.attributes.delegate.data) : undefined,
        });
    }
}