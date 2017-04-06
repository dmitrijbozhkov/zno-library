export enum HistoryTypes {
    push,
    replace,
    go,
    goBack,
    goForward
}
export declare type Pathname = string;
export declare type GenericInput = {
    type: string;
    pathname?: Pathname;
    state?: any;
};
export declare type PushHistoryInput = {
    type: string;
    pathname: Pathname;
    state?: any;
};
export declare type ReplaceHistoryInput = {
    type: string;
    pathname: Pathname;
    state?: any;
};
export declare type GoHistoryInput = {
    type: string;
    amount: number;
};
export declare type GoBackHistoryInput = {
    type: string;
};
export declare type GoForwardHistoryInput = {
    type: string;
};
export declare type HistoryState = {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
};
export declare type HistoryInput = PushHistoryInput | ReplaceHistoryInput | GoHistoryInput | GoBackHistoryInput | GoForwardHistoryInput;