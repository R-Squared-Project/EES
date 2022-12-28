export default class Contract {
    constructor(
        private _id: string,
        private _externalId: string
    ) {}

    get id(): string {
        return this._id;
    }

    get externalId(): string {
        return this._externalId;
    }
}
