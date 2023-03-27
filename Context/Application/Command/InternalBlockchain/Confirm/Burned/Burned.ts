export default class Burned {
    constructor(
        private _depositId: string
    ) {}

    get depositId(): string {
        return this._depositId
    }
}
