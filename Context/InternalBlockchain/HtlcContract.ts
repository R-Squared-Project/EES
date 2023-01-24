export default class HtlcContract {
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

    hasExternalId(): boolean {
        return this._externalId !== ''
    }
}
