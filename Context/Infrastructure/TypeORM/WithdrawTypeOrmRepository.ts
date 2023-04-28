import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import InternalContract from "context/Domain/InternalContract";

@Injectable()
export default class WithdrawTypeOrmRepository implements WithdrawRepositoryInterface {
    constructor(@Inject("DataSource") private _datasource: DataSource) {}

    async save(withdraw: Withdraw) {
        await this._datasource
            .getRepository<WithdrawRequest>(WithdrawRequest)
            .upsert(withdraw.withdrawRequest, ["idString"]);
        await this._datasource
            .getRepository<InternalContract>(InternalContract)
            .upsert(withdraw.internalContract, ["idString"]);
        await this._datasource.getRepository<Withdraw>(Withdraw).upsert(withdraw, ["id"]);
    }
}
