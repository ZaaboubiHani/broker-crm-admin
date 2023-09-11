export default class SpecialityModel {
    id?: number | undefined;
    name?: string | undefined;

    constructor(data?:SpecialityModel) {
        this.id = data?.id;
        this.name = data?.name;
    }

    static fromJson(json: any): SpecialityModel {
        return new SpecialityModel({
            id: json.id,
            name: json.attributes.name,
        });
    }
}
