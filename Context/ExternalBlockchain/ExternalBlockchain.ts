import RepositoryInterface from "./Repository/RepositoryInterface";
import EthereumRepository from "./Repository/EthereumRepository";
import StubRepository from "./Repository/StubRepository";
import { Inject, Injectable } from "@nestjs/common";
import config from "context/config";
import Contract from "context/ExternalBlockchain/Contract";

@Injectable()
class ExternalBlockchain {
    private readonly _repository: RepositoryInterface;

    public constructor(@Inject("ExternalBlockchainRepositoryName") repository: Repository) {
        this._repository = this.createRepository(repository);
    }

    get repository(): RepositoryInterface {
        if (!this._repository) {
            throw new Error("Repository is not initialized");
        }

        return this._repository;
    }

    private createRepository(repository: Repository): RepositoryInterface {
        switch (repository) {
            case "ethereum":
                return new EthereumRepository();
            case "stub":
                return new StubRepository();
            default:
                throw new Error("External repository invalid");
        }
    }

    public async redeem(contractId: string, secret: string) {
        return this._repository.redeem(contractId, secret, config.eth.receiver);
    }

    public getAsset() {
        return this._repository.getAsset();
    }

    public async getGasPrice(): Promise<string> {
        return await this._repository.getGasPrice();
    }

    public async createWithdrawHTLC(
        receiver: string,
        hashlock: string,
        timelock: number,
        amount: string
    ): Promise<string> {
        return await this._repository.createWithdrawHTLC(receiver, hashlock, timelock, amount);
    }

    public async loadWithdrawContract(txHash: string, contractId: string): Promise<Contract | null> {
        return await this._repository.loadWithdrawContract(txHash, contractId);
    }

    public async refund(contractId: string) {
        return await this._repository.refund(contractId);
    }
}

export default ExternalBlockchain;
