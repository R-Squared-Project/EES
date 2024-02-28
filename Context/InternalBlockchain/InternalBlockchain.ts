import RepositoryInterface from "./Repository/RepositoryInterface";
import NativeRepository from "./Repository/NativeRepository";
import StubRepository from "./Repository/StubRepository";
import config from "context/config";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "./OperationRedeem";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import { Injectable } from "@nestjs/common";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";
import { Map } from "immutable";

type Repository = "native" | "stub";

interface Config {
    repository: Repository;
}

@Injectable()
class InternalBlockchain {
    public constructor(private readonly _repository: RepositoryInterface) {}

    public static async init(config: Config) {
        const repository = await InternalBlockchain.createRepository(config.repository);

        return new InternalBlockchain(repository);
    }

    public disconnect() {
        this._repository.disconnect();
    }

    static async createRepository(repository: Repository): Promise<RepositoryInterface> {
        switch (repository) {
            case "native":
                return await NativeRepository.init(
                    config.r_squared.node_urls,
                    config.r_squared.ees_account as string,
                    config.r_squared.account_private_key as string,
                    config.r_squared.rqeth_asset_symbol as string,
                    config.r_squared.chain_id as string,
                    // config.r_squared.chain_network_name as string
                );
            case "stub":
                return new StubRepository();
            default:
                throw new Error("Internal repository invalid");
        }
    }

    get repository(): RepositoryInterface {
        if (!this._repository) {
            throw new Error("Repository is not initialized");
        }

        return this._repository;
    }

    async createContract(
        externalId: string,
        accountToName: string,
        amount: string,
        hashLock: string,
        timeLock: number
    ) {
        await this._repository.createContract(externalId, accountToName, amount, hashLock, timeLock);
    }

    async getIncomingContracts(start: string): Promise<Contract[]> {
        return await this._repository.getIncomingContracts(start);
    }

    async getRefundOperations(account: string): Promise<OperationRefund[]> {
        return await this._repository.getRefundOperations(account);
    }

    async getRedeemOperations(account: string): Promise<OperationRedeem[]> {
        return await this._repository.getRedeemOperations(account);
    }

    async burnAsset(amount: string) {
        await this._repository.burnAsset(amount);
    }

    async getBurnOperations(account: string): Promise<OperationBurn[]> {
        return await this._repository.getBurnOperations(account);
    }

    async getInternalAsset(): Promise<Map<string, any>> {
        return await this._repository.getInternalAsset();
    }

    async getAsset(assetId: string): Promise<Map<string, any>> {
        return await this._repository.getAsset(assetId);
    }

    async getAccountHistory(lastProcessedAccountHistoryOperation: string): Promise<WithdrawTransaction[]> {
        return await this.repository.getAccountHistory(lastProcessedAccountHistoryOperation);
    }

    async getAccount(accountId: string): Promise<Map<string, any>> {
        return await this.repository.getAccount(accountId);
    }

    async getEesAccount(): Promise<Map<string, any>> {
        return await this.repository.getEesAccount();
    }

    async getObject(objectId: string): Promise<Map<string, any>> {
        return await this.repository.getObject(objectId);
    }

    async getLastIrreversibleBlockNumber(): Promise<number> {
        return await this.repository.getLastIrreversibleBlockNumber();
    }

    async withdrawRedeem(preimage: string, contractId: string, amount: string) {
        return await this.repository.withdrawRedeem(preimage, contractId, amount);
    }
}

export default InternalBlockchain;
