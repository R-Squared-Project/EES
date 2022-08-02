import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";
import {DataSource} from "typeorm";

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {
        _datasource.initialize()
    }

    create(deposit: Deposit): void {
        // console.log(this._datasource.getRepository<Deposit>(DepositEntity))
        this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    getBySecret(sessionId: string): Deposit {
        return new Deposit(sessionId);
    }

    save(deposit: Deposit): void {
        return undefined
    }

}