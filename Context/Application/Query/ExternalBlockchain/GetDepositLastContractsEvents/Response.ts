import {EventData} from "web3-eth-contract";

export default class Response {
    constructor(
        private readonly _fromBlock: number,
        private readonly _toBlock: number,
        private readonly _events: EventData[]
    ) {}

    get fromBlock(): number {
        return this._fromBlock;
    }

    get toBlock(): number {
        return this._toBlock;
    }

    get events(): EventData[] {
        return this._events;
    }
}
