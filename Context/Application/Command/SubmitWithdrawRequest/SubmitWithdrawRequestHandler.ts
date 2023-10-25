import { UseCase } from "context/Core/Domain/UseCase";
import SubmitWithdrawRequest from "./SubmitWithdrawRequest";
import { DatabaseConnectionError } from "context/Infrastructure/Errors";
import NativeAccount from "context/Domain/ValueObject/NativeAccount";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export default class SubmitWithdrawRequestHandler implements UseCase<SubmitWithdrawRequest, string> {
    constructor(
        @Inject("WithdrawRequestRepositoryInterface") private _repository: WithdrawRequestRepositoryInterface
    ) {}

    async execute(command: SubmitWithdrawRequest): Promise<string> {
        const nativeAccount = NativeAccount.create(command.nativeAccount);
        const withdrawRequest = WithdrawRequest.create(
            nativeAccount,
            command.amountToPayInRQETH,
            command.addressOfUserInEthereum,
            command.withdrawalFeeAmount,
            command.withdrawalFeeCurrency
        );

        try {
            await this._repository.create(withdrawRequest);
        } catch (e: unknown) {
            throw new DatabaseConnectionError();
        }

        return withdrawRequest.id.toString();
    }
}
