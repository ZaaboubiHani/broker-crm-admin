
export default class VisitTaskModel {
    date?: Date;
    tasksWilayasCommunes?: string[];
    visitsWilayasCommunes?: string[];
    numVisits?: number;
    numTasks?: number;

    constructor(params: {
        date?: Date,
        tasksWilayasCommunes?: string[],
        visitsWilayasCommunes?: string[],
        numVisits?: number,
        numTasks?: number,
    }
    ) {
        this.date = params.date;
        this.tasksWilayasCommunes = params.tasksWilayasCommunes;
        this.visitsWilayasCommunes = params.visitsWilayasCommunes;
        this.numVisits = params.numVisits;
        this.numTasks = params.numTasks;
    }

    static fromJson(json: any): VisitTaskModel {
        var parsedDate = new Date();
        if (json.date) {
            const timestamp = Date.parse(json.date);
            parsedDate = new Date(timestamp);
        }
        return new VisitTaskModel({
            date: parsedDate,
            tasksWilayasCommunes: Array.from(new Set(json.wilayasCommuns.tasks.map((obj: any) => obj.wilaya + ',' + obj.commun))),
            visitsWilayasCommunes: Array.from(new Set(json.wilayasCommuns.visits.map((obj: any) => obj.wilaya + ',' + obj.commun))),
            numVisits: json.numVisits,
            numTasks: json.numTasks,

        });
    }
}