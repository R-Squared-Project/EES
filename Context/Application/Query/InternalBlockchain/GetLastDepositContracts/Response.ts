import Contract from "context/InternalBlockchain/Contract";

export default class Response {
    constructor(
        private readonly _contracts: Contract[]
    ) {}

    get contracts(): Contract[] {
        return this._contracts;
    }
}
