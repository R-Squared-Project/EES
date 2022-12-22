import {DataSource} from "typeorm";
import DepositRequest from "../../Domain/DepositRequest";
import DepositRequestRepositoryInterface from "../../Domain/DepositRequestRepositoryInterface";

export default class DepositRequestTypeOrmRepository implements DepositRequestRepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(depositRequest: DepositRequest) {
        await this._datasource.getRepository<DepositRequest>(DepositRequest).save(depositRequest)
    }
}
