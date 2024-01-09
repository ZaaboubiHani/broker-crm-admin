
export default class UserTrackingModel {
    id?: number;
    createdAt?: Date;
    latitude?: string;
    longitude?: string;

    constructor(data?: UserTrackingModel) {
        this.id = data?.id;
        this.createdAt = data?.createdAt;
        this.latitude = data?.latitude;
        this.longitude = data?.longitude;
    }

    static fromJson(json: any): UserTrackingModel {
        return new UserTrackingModel({
            id: json.id,
            createdAt: new Date(json.attributes.createdAt),
            latitude: json.attributes.location?.replace(/Latitude: |Longitude: /g, '').split(',')[0].trim(),
            longitude: json.attributes.location?.replace(/Latitude: |Longitude: /g, '').split(',')[1].trim(),
        });
    }
}
