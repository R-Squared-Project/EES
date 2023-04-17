import {UseCase} from "context/Core/Domain/UseCase";
import SubmitWithdrawRequest from "./SubmitWithdrawRequest";
import {DatabaseConnectionError} from "context/Infrastructure/Errors";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import HashLock from "context/Domain/ValueObject/HashLock";
import * as Errors from "./Errors";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export default class SubmitWithdrawRequestHandler implements UseCase<SubmitWithdrawRequest, string> {
    constructor(
        @Inject("WithdrawRequestRepositoryInterface") private _repository: WithdrawRequestRepositoryInterface
    ) {}

    async execute(command: SubmitWithdrawRequest): Promise<string> {
        const revpopAccount = RevpopAccount.create(command.revpopAccount)
        const hashLock = HashLock.create(command.hashLock)

        const exists = await this._repository.load(hashLock)

        if (exists) {
            throw new Errors.WithdrawRequestAlreadyExists(command.hashLock)
        }

        const withdrawRequest = WithdrawRequest.create(revpopAccount, hashLock)

        try {
            await this._repository.create(withdrawRequest)
        } catch (e: unknown) {
            throw new DatabaseConnectionError()
        }

        return withdrawRequest.id.toString()
    }
}
