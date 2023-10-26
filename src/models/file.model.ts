

export default class FileModel {
    id?: number;
    name?: string;
    width?: number;
    height?: number;
    url?: string;

    constructor(data?: FileModel) {
        this.id = data?.id;
        this.name = data?.name;
        this.width = data?.width;
        this.height = data?.height;
        this.url = data?.url;
    }

    static fromJson(json: any): FileModel {
        return new FileModel({
            id: json.id,
            name: json.attributes.name,
            width: json.attributes.width,
            height: json.attributes.height,
            url: "https://bio.brokermarketing.dz" + json.attributes.url,

        });
    }
}
