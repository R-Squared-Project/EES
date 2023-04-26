export default class HtlcContract {
    constructor(private _id: string, private _message: string) {}

    get id(): string {
        return this._id;
    }

    get message(): string {
        return this._message;
    }

    hasMessage(): boolean {
        return this._message !== "";
    }
}
