import RepositoryInterface from "./Repository/RepositoryInterface";
import RevpopRepository from "./Repository/RevpopRepository";
import StubRepository from "./Repository/StubRepository";
import config from "context/config";

type Repository = 'revpop' | 'stub'

interface Config {
    repository: Repository
}

class InternalBlockchain {
    public constructor(
        private readonly repository: RepositoryInterface
    ) {}

    public static async init(config: Config) {
        const repository = await InternalBlockchain.createRepository(config.repository)

        return new InternalBlockchain(repository)
    }

    static async createRepository(repository: Repository): Promise<RepositoryInterface> {
        switch (repository) {
            case 'revpop':
                return await RevpopRepository.init(
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

    async createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        await this.repository.createContract(externalId, accountToName, amount, hashLock, timeLock)
    }
}

export default InternalBlockchain;
