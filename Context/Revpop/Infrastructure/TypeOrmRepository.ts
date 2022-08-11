import {DataSource} from "typeorm";
import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    create(deposit: Deposit): void {
        this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }
}