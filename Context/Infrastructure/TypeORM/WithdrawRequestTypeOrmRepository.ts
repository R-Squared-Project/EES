import { DataSource } from "typeorm";
import WithdrawRequest, { STATUS_CREATED } from "../../Domain/WithdrawRequest";
import WithdrawRequestRepositoryInterface from "../../Domain/WithdrawRequestRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export default class WithdrawRequestTypeOrmRepository implements WithdrawRequestRepositoryInterface {
    constructor(@Inject("DataSource") private _datasource: DataSource) {}

    async create(withdrawRequest: WithdrawRequest) {
        await this._datasource.getRepository<WithdrawRequest>(WithdrawRequest).save(withdrawRequest);
    }

    async findAllCreated(): Promise<WithdrawRequest[]> {
        return await this._datasource
            .getRepository<WithdrawRequest>(WithdrawRequest)
            .createQueryBuilder("withdraw_request")
            .where("withdraw_request.status = :status", { status: STATUS_CREATED })
            .getMany();
    }

    async save(request: WithdrawRequest) {
        await this._datasource.getRepository<WithdrawRequest>(WithdrawRequest).upsert(request, ["id"]);
    }
}
