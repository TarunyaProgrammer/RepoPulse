export declare class StorageService {
    static processEvent(type: string, payload: any): Promise<void>;
    private static calculateScore;
    static getRepositoryActivity(repoName: string): Promise<(import("mongoose").Document<unknown, {}, {
        repository: string;
        commits_last_24h: number;
        pull_requests_open: number;
        releases: number;
        activity_score: number;
        updated_at: NativeDate;
        last_push?: NativeDate | null;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        repository: string;
        commits_last_24h: number;
        pull_requests_open: number;
        releases: number;
        activity_score: number;
        updated_at: NativeDate;
        last_push?: NativeDate | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null>;
    static getRecentEvents(limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
        repository: string;
        event_type: string;
        timestamp: NativeDate;
        payload?: any;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        repository: string;
        event_type: string;
        timestamp: NativeDate;
        payload?: any;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[]>;
}
//# sourceMappingURL=storage.service.d.ts.map