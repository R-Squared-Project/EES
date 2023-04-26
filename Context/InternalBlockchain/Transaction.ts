export default class Transaction {
    constructor(private _id: string, private _message: string) {}

    get id(): string {
        return this._id;
    }
}
