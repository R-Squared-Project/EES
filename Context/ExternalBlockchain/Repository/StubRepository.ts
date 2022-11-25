import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";

export default class StubRepository implements RepositoryInterface {
    public _txIncluded = true
    public _contract: Contract | null = null

    async txIncluded(txHash: string): Promise<boolean> {
        return this._txIncluded
    }

    async load(txHash: string, contractId: string): Promise<Contract | null> {
        return this._contract
    }

    reset() {
        this._txIncluded = true
        this._contract = null
    }
}
