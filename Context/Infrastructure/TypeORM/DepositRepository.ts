import {DataSource} from 'typeorm';
import DepositRepositoryInterface from '../../Domain/DepositRepositoryInterface';
import Deposit, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN } from '../../Domain/Deposit';

export default class TypeOrmRepository implements DepositRepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(deposit: Deposit) {
        await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    async save(deposit: Deposit) {
        await this._datasource.getRepository<Deposit>(Deposit).upsert(deposit, ['id'])
    }

    async exists(contractId: string): Promise<boolean> {
        const count = await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .where('externalContract.id = :contractId', { contractId: contractId })
            .getCount()

        return count > 0;
    }

    async getById(id: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('deposit.id = :depositId', {depositId: id})
            .getOne()
    }

    async getByExternalId(externalId: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('externalContract._txHash = :txHash', {externalId: externalId})
            .getOne()
    }

    async getWaitingToRedeem(): Promise<Deposit[]> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .where('deposit.status = :status', {status: STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN})
            .getMany()
    }
}
