export default class CommentModel {
    id?: number | undefined;
    comment?: string | undefined;

    constructor(data?:CommentModel) {
        this.id = data?.id;
        this.comment = data?.comment;
    }

    static fromJson(json: any): CommentModel {
        return new CommentModel({
            id: json?.id,
            comment: json?.attributes?.comment,
        });
    }
}
