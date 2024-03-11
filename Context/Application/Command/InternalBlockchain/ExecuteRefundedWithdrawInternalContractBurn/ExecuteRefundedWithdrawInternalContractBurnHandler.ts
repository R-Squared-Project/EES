import { UseCase } from "context/Core/Domain/UseCase";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";
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
        this.validateTransaction(command.transaction);

        const withdraw = await this.withdrawRepository.getByInternalContractId(command.transaction.htlcId ?? "");

        if (!withdraw) {
            throw new Error(`Withdraw transaction with internal contract ${command.transaction.htlcId} not found.`);
        }



        withdraw.setInternalRedeemBlockNumber(command.transaction.blockNumber ?? 0);

        await this.withdrawRepository.save(withdraw);
    }

    private validateTransaction(transaction: WithdrawTransaction) {
        if (!transaction.htlcId) {
            throw new Error(`Undefined HTLC ID in transaction ${transaction.transactionId}.`);
        }
        if (!transaction.blockNumber) {
            throw new Error(`Undefined blockNumber in transaction ${transaction.transactionId}.`);
        }
    }
}
