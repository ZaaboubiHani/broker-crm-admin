import UserModel from "./user.model";

export enum TodoStatus {
    pending = 'Pending',
    done = 'Done',
    cancelled = 'Cancelled',
    ignored = 'Ignored',
}

export default class TodoModel {
    id?: number;
    delegate?: UserModel;
    supervisor?: UserModel;
    startDate?: Date;
    endDate?: Date;
    targetRemark?: string;
    remark?: string;
    region?: string;
    task?: string;
    action?: string;
    status?: TodoStatus;

    constructor(params: {
        id?: number,
        delegate?: UserModel,
        supervisor?: UserModel,
        startDate?: Date,
        endDate?: Date,
        targetRemark?: string,
        remark?: string,
        region?: string,
        task?: string,
        action?: string,
        status?: TodoStatus,
    }
    ) {
        this.id = params.id;
        this.delegate = params.delegate;
        this.supervisor = params.supervisor;
        this.startDate = params.startDate;
        this.endDate = params.endDate;
        this.targetRemark = params.targetRemark;
        this.remark = params.remark;
        this.region = params.region;
        this.task = params.task;
        this.action = params.action;
        this.status = params.status;
    }

    static fromJson(json: any): TodoModel {

        var parsedStartDate = new Date();
        if (json.attributes.startDate !== null && json.attributes.startDate !== undefined) {
            const timestamp = Date.parse(json.attributes.startDate);
            parsedStartDate = new Date(timestamp);
        }
        var parsedEndDate = new Date();
        if (json.attributes.endDate !== null && json.attributes.endDate !== undefined) {
            const timestamp = Date.parse(json.attributes.endDate);
            parsedEndDate = new Date(timestamp);
        }

        return new TodoModel
            ({
                id: json.id,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                delegate: json.attributes.delegate.data !== null && json.attributes.delegate.data !== undefined ? UserModel.fromJson(json.attributes.delegate.data) : undefined,
                supervisor: json.attributes.supervisor.data !== null && json.attributes.supervisor.data !== undefined ? UserModel.fromJson(json.attributes.supervisor.data) : undefined,
                targetRemark: json.attributes.targetRemark,
                remark: json.attributes.remark,
                region: json.attributes.region,
                task: json.attributes.task,
                action: json.attributes.action,
                status: json.attributes.status,
            });
    }
}