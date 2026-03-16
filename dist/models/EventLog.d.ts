import { Schema } from 'mongoose';
export declare const EventLog: import("mongoose").Model<{
    repository: string;
    event_type: string;
    timestamp: NativeDate;
    payload?: any;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
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
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    repository: string;
    event_type: string;
    timestamp: NativeDate;
    payload?: any;
}, import("mongoose").Document<unknown, {}, {
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
}, unknown, {
    repository: string;
    event_type: string;
    timestamp: NativeDate;
    payload?: any;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    repository: string;
    event_type: string;
    timestamp: NativeDate;
    payload?: any;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=EventLog.d.ts.map