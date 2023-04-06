import RepositoryInterface from "./Repository/RepositoryInterface";
import RevpopRepository from "./Repository/RevpopRepository";
import StubRepository from "./Repository/StubRepository";
import config from "context/config";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "./OperationRedeem";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import {Injectable} from "@nestjs/common";

type Repository = 'revpop' | 'stub'

interface Config {
    repository: Repository
}

@Injectable()
class InternalBlockchain {
    public constructor(
        private readonly _repository: RepositoryInterface
    ) {}

    public static async init(config: Config) {
        const repository = await InternalBlockchain.createRepository(config.repository)

        return new InternalBlockchain(repository)
    }

    public disconnect() {
        this._repository.disconnect()
    }

    static async createRepository(repository: Repository): Promise<RepositoryInterface> {
        switch (repository) {
            case 'revpop':
                return await RevpopRepository.init(
                    config.revpop.node_url as string,
                    config.revpop.ees_account as string,
                    config.revpop.account_private_key as string,
                    config.revpop.asset_symbol as string,
                    config.revpop.chain_id as string
                )
            case 'stub':
                return new StubRepository()
            default:
                throw new Error('Internal repository invalid')
        }
    }

    get repository(): RepositoryInterface {
        if (!this._repository) {
            throw new Error('Repository is not initialized')
        }

        return this._repository
    }

    async createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        await this._repository.createContract(externalId, accountToName, amount, hashLock, timeLock)
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

    async burnAsset(amount: number) {
        await this._repository.burnAsset(amount);
    }

    async getAsset(): Promise<any> {
        return await this._repository.getAsset();
    }
}

export default InternalBlockchain;
