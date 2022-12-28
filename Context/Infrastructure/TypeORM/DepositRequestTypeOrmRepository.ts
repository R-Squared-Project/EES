import {DataSource} from "typeorm";
import DepositRequest from "../../Domain/DepositRequest";
import DepositRequestRepositoryInterface from "../../Domain/DepositRequestRepositoryInterface";
import HashLock from "context/Domain/ValueObject/HashLock";

export default class DepositRequestTypeOrmRepository implements DepositRequestRepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(depositRequest: DepositRequest) {
        await this._datasource.getRepository<DepositRequest>(DepositRequest).save(depositRequest)
    }

    async load(hashLock: HashLock): Promise<DepositRequest | null> {
        return await this._datasource.getRepository<DepositRequest>(DepositRequest)
            .createQueryBuilder('deposit_request')
            .where({
                _hashLock: hashLock
            })
            .getOne()
    }
}
