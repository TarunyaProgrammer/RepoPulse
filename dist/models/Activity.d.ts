import { Schema } from 'mongoose';
export declare const Activity: import("mongoose").Model<{
    repository: string;
    commits_last_24h: number;
    pull_requests_open: number;
    releases: number;
    activity_score: number;
    updated_at: NativeDate;
    last_push?: NativeDate | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
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
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    repository: string;
    commits_last_24h: number;
    pull_requests_open: number;
    releases: number;
    activity_score: number;
    updated_at: NativeDate;
    last_push?: NativeDate | null;
}, import("mongoose").Document<unknown, {}, {
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
}, unknown, {
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
}>, {
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
}>;
//# sourceMappingURL=Activity.d.ts.map