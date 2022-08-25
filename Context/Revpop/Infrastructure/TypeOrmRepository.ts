import {DataSource} from "typeorm";
import RepositoryInterface from "../Domain/RepositoryInterface";
import Deposit from "../Domain/Deposit";
import TxHash from "../Domain/TxHash";

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(deposit: Deposit): Promise<void> {
        await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    async getByTxHash(txHash: string): Promise<Deposit | null> {
        return await this._datasource.getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .where({
                _txHash: TxHash.create(txHash).getValue()
            })
            .getOne()
    }

    async getByRevpopContractId(contractId: string): Promise<Deposit | null> {
        return await this._datasource.getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .where({
                _revpopContractId: contractId
            })
            .getOne()
    }

    async save(deposit: Deposit): Promise<void> {
        // "upsert" is used because "save" method not working: https://github.com/typeorm/typeorm/issues/4122
        await this._datasource.getRepository<Deposit>(Deposit).upsert(deposit, ['_txHash'])
    }
}