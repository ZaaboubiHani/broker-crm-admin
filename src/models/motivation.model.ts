export default class MotivationModel {
    id?: number | undefined;
    content?: string | undefined;

    constructor(data?:MotivationModel) {
        this.id = data?.id;
        this.content = data?.content;
    }

    static fromJson(json: any): MotivationModel {
        return new MotivationModel({
            id: json.id,
            content: json.attributes.content,
        });
    }
}
