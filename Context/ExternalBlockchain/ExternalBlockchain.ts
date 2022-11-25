import RepositoryInterface from "./Repository/RepositoryInterface";
import EthereumRepository from "./Repository/EthereumRepository";
import StubRepository from "./Repository/StubRepository";

class ExternalBlockchain {
    private _repository?: RepositoryInterface

    public init(repository: Repository) {
        this._repository = this.createRepository(repository)
    }

    get repository(): RepositoryInterface {
        if (!this._repository) {
            throw new Error('Repository is not initialized')
        }

        return this._repository
    }

    private createRepository(repository: Repository): RepositoryInterface {
        switch (repository) {
            case 'ethereum':
                return new EthereumRepository()
            case 'stub':
                return new StubRepository()
            default:
                throw new Error('External repository invalid')
        }
    }
}

export default new ExternalBlockchain()
