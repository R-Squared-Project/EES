import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";
import {DataSource} from "typeorm";

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    create(deposit: Deposit): void {
        this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    async getBySecret(sessionId: string): Promise<Deposit | null> {
        return await this._datasource.getRepository<Deposit>(Deposit).findOneById(sessionId)
    }

    async save(deposit: Deposit): Promise<void> {
        // "upsert" is used because "save" method not working: https://github.com/typeorm/typeorm/issues/4122
        await this._datasource.getRepository<Deposit>(Deposit).upsert(deposit, ['sessionId'])
    }

}