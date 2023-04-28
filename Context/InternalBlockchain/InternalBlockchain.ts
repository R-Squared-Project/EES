import RepositoryInterface from "./Repository/RepositoryInterface";
import RevpopRepository from "./Repository/RevpopRepository";
import StubRepository from "./Repository/StubRepository";
import config from "context/config";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "./OperationRedeem";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import { Injectable } from "@nestjs/common";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";
import { Map } from "immutable";

type Repository = "revpop" | "stub";

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
            case "revpop":
                return await RevpopRepository.init(
                    config.revpop.node_url as string,
                    config.revpop.ees_account as string,
                    config.revpop.account_private_key as string,
                    config.revpop.asset_symbol as string,
                    config.revpop.chain_id as string
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

    async getAccountHistory(): Promise<WithdrawTransaction[]> {
        return await this.repository.getAccountHistory();
    }

    async getAccount(accountId: string): Promise<Map<string, any>> {
        return await this.repository.getAccount(accountId);
    }

    async getEesAccount(): Promise<Map<string, any>> {
        return await this.repository.getEesAccount();
    }
}

export default InternalBlockchain;
