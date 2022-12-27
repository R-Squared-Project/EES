import {DataSource} from 'typeorm';
import RepositoryInterface from '../../Domain/RepositoryInterface';
import Deposit from '../../Domain/Deposit';

export default class TypeOrmRepository implements RepositoryInterface {
    constructor(
        private _datasource: DataSource
    ) {}

    async create(deposit: Deposit) {
        await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
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
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('deposit.id = :depositId', {depositId: id})
            .getOne()
    }
}
