import RepositoryInterface from "./Repository/RepositoryInterface";
import RevpopRepository from "./Repository/RevpopRepository";
import StubRepository from "./Repository/StubRepository";
import config from "context/config";

type Repository = 'revpop' | 'stub'

interface Config {
    repository: Repository
}

class InternalBlockchain {
    private readonly repository: RepositoryInterface

    public constructor(config: Config) {
        this.repository = this.createRepository(config.repository)
    }

    public static init(config: Config) {
        return new InternalBlockchain(config)
    }

    private createRepository(repository: Repository): RepositoryInterface {
        switch (repository) {
            case 'revpop':
                return new RevpopRepository(
                    config.revpop.node_url as string,
                    config.revpop.account_from as string,
                    config.revpop.account_private_key as string,
                    config.revpop.asset_symbol as string
                )
            case 'stub':
                return new StubRepository()
            default:
                throw new Error('Internal repository invalid')
        }
    }

    createContract(accountToName: string, amount: number, hashLock: string, timeLock: number) {
        this.repository.createContract(accountToName, amount, hashLock, timeLock)
    }
}

export default InternalBlockchain;
