import { UseCase } from "context/Core/Domain/UseCase";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";
import ExecuteRefundedWithdrawInternalContractBurn
    from "./ExecuteRefundedWithdrawInternalContractBurn";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";

@Injectable()
export default class ExecuteRefundedWithdrawInternalContractBurnHandler
    implements UseCase<ExecuteRefundedWithdrawInternalContractBurn, void>
{
    public constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("InternalBlockchain") private internalBlockchain: InternalBlockchain,
    ) {}

    public async execute(command: ExecuteRefundedWithdrawInternalContractBurn): Promise<void> {
        await this.internalBlockchain.burnAsset(command.withdraw.amountOfWithdrawalFee as unknown as string);
        command.withdraw.refundedBurned();

        await this.withdrawRepository.save(command.withdraw);
    }

}
