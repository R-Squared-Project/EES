import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN } from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import InternalContract from "context/Domain/InternalContract";

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

        await this._datasource.getRepository<Withdraw>(Withdraw).upsert(withdraw, ["id"]);
    }

    async getAllForCheck(): Promise<Withdraw[]> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            // .leftJoinAndSelect("withdraw.externalContract", "externalContract")
            .leftJoinAndSelect("withdraw.withdrawRequest", "withdrawRequest")
            // .leftJoinAndSelect("withdraw.internalContract", "internalContract")
            .where("withdraw.status = :status", { status: STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN })
            .getMany();
    }

    async getById(id: string): Promise<Withdraw | null> {
        return await this._datasource
            .getRepository<Withdraw>(Withdraw)
            .createQueryBuilder("withdraw")
            .leftJoinAndSelect("withdraw._externalContract", "externalContract")
            .leftJoinAndSelect("withdraw._internalContract", "internalContract")
            .leftJoinAndSelect("withdraw._withdrawRequest", "withdrawRequest")
            .where("withdraw.id = :withdrawId", { withdrawId: id })
            .getOne();
    }
}
