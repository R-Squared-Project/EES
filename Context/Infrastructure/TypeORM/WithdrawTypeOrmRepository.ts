import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw, {
    STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
    STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN,
} from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import InternalContract from "context/Domain/InternalContract";
import ExternalContract from "context/Domain/ExternalContract";

@Injectable()
export default class WithdrawTypeOrmRepository implements WithdrawRepositoryInterface {
    constructor(@Inject("DataSource") private _datasource: DataSource) {}

    async save(withdraw: Withdraw) {
        if (withdraw.withdrawRequest) {
            await this._datasource
                .getRepository<WithdrawRequest>(WithdrawRequest)
                .upsert(withdraw.withdrawRequest, ["idString"]);
        }

        if (withdraw.internalContract) {
            await this._datasource
                .getRepository<InternalContract>(InternalContract)
                .upsert(withdraw.internalContract, ["idString"]);
        }

        if (withdraw.externalContract) {
            await this._datasource
                .getRepository<ExternalContract>(ExternalContract)
                .upsert(withdraw.externalContract, ["idString"]);
        }

        await this._datasource.getRepository<Withdraw>(Withdraw).upsert(withdraw, ["id"]);
    }

    async getAllForCheck(): Promise<Withdraw[]> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("withdraw.status = :status", { status: STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN })
            .getMany();
    }

    async getById(id: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("withdraw.id = :withdrawId", { withdrawId: id })
            .getOne();
    }

    async getByTxHash(txHash: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("withdraw.txHash = :withdrawTxHash", { withdrawTxHash: txHash })
            .getOne();
    }

    async getByRequestId(requestId: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.externalContract", "externalContract")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("withdrawRequest.id = :requestId", { requestId: requestId })
            .getOne();
    }

    async getByRedeemTxHash(txHash: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.externalContract", "externalContract")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("withdraw._externalBlockchainRedeemTxHash = :txHash", { txHash })
            .getOne();
    }

    async getByExternalContractId(contractId: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.externalContract", "externalContract")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .where("externalContract.id = :contractId", { contractId })
            .getOne();
    }

    async getByRedeemStatus(): Promise<Withdraw[]> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw.externalContract", "externalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .where("withdraw.status = :status", { status: STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN })
            .getMany();
    }
}
