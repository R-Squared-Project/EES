import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";
import {DataSource} from "typeorm";
import SessionId from "../Domain/SessionId";

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(deposit: Deposit) {
        await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    async getBySessionId(sessionId: string): Promise<Deposit | null> {
        return await this._datasource.getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .where({
                _sessionId: SessionId.create(sessionId).getValue()
            })
            .getOne()
    }

    async save(deposit: Deposit): Promise<void> {
        // "upsert" is used because "save" method not working: https://github.com/typeorm/typeorm/issues/4122
        await this._datasource.getRepository<Deposit>(Deposit).upsert(deposit, ['_sessionId'])
    }

}