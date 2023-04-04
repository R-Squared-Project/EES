import {DataSource} from 'typeorm';
import DepositRepositoryInterface from '../../Domain/DepositRepositoryInterface';
import Deposit, {
    STATUS_BURNED, STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN, STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN
} from '../../Domain/Deposit';
import InternalContract from 'context/Domain/InternalContract';
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export default class TypeOrmRepository implements DepositRepositoryInterface {
    constructor(
        @Inject("DataSource") private _datasource: DataSource
    ) {}

    async create(deposit: Deposit) {
        await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
    }

    async save(deposit: Deposit) {
        if (deposit.internalContract instanceof InternalContract) {
            await this._datasource.getRepository<InternalContract>(InternalContract).upsert(deposit.internalContract, ['idString'])
        }

        await this._datasource.getRepository<Deposit>(Deposit).upsert(deposit, ['id'])

        // Don't work
        // await this._datasource.getRepository<Deposit>(Deposit).save(deposit)
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

    async getByRequestId(requestId: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('depositRequest.id = :requestId', {requestId: requestId})
            .getOne()
    }

    async getByTxHash(txHash: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('externalContract._txHash = :txHash', {txHash})
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

    async getByRedeemTxHash(txHash: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('deposit._externalBlockchainRedeemTxHash = :txHash', {txHash})
            .getOne()
    }

    async getByBurnTxHash(txHash: string): Promise<Deposit | null> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .where('deposit._internalBlockchainBurnTxHash = :txHash', {txHash})
            .getOne()
    }

    async getOverdueTimeLock(): Promise<Deposit[]> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .where('deposit.status in (:status1, :status2)', {
                status1: STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
                status2: STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN
            })
            .andWhere('externalContract._timeLock <= NOW()')
            .getMany()
    }

    async getBurned(): Promise<Deposit[]> {
        return await this._datasource
            .getRepository<Deposit>(Deposit)
            .createQueryBuilder('deposit')
            .leftJoinAndSelect('deposit._externalContract', 'externalContract')
            .leftJoinAndSelect('deposit._depositRequest', 'depositRequest')
            .leftJoinAndSelect('deposit._internalContract', 'internalContract')
            .where('deposit.status = :status', {
                status: STATUS_BURNED
            })
            .getMany()
    }
}
