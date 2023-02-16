import InternalHtlcContract from "context/InternalBlockchain/HtlcContract";

export default class Response {
    constructor(
        private readonly _contracts: InternalHtlcContract[]
    ) {}

    get contracts(): InternalHtlcContract[] {
        return this._contracts;
    }
}
