import {DataSource} from "typeorm";
import WithdrawRequest from "../../Domain/WithdrawRequest";
import WithdrawRequestRepositoryInterface from "../../Domain/WithdrawRequestRepositoryInterface";
import HashLock from "context/Domain/ValueObject/HashLock";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export default class WithdrawRequestTypeOrmRepository implements WithdrawRequestRepositoryInterface {
    constructor(
        @Inject("DataSource") private _datasource: DataSource
    ) {}

    async create(withdrawRequest: WithdrawRequest) {
        await this._datasource.getRepository<WithdrawRequest>(WithdrawRequest).save(withdrawRequest)
    }

    async load(hashLock: HashLock): Promise<WithdrawRequest | null> {
        return await this._datasource.getRepository<WithdrawRequest>(WithdrawRequest)
            .createQueryBuilder('withdraw_request')
            .where({
                _hashLock: hashLock
            })
            .getOne()
    }
}
