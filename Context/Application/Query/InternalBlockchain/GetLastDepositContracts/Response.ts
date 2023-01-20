import Contract from "context/InternalBlockchain/Contract";

export default class Response {
    constructor(
        private readonly _lastContractId: string,
        private readonly _contracts: Contract[]
    ) {}
}
