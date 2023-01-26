export default class SuccessResponse {
    constructor(
        private _data: any = null
    ) {}

    get data(): any {
        return this._data;
    }

    static create(data: any = null) {
        return new SuccessResponse(data)
    }
}