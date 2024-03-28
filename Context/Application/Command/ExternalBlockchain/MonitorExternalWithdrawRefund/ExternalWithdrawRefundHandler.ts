import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { Inject, Injectable } from "@nestjs/common";
import ExternalWithdrawRefund from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefund";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";

@Injectable()
export default class ExternalWithdrawRefundHandler implements UseCase<ExternalWithdrawRefund, void> {
    constructor(
        private externalBlockchain: ExternalBlockchain,
        @Inject("WithdrawRepositoryInterface") private withdrawRepository: WithdrawRepositoryInterface
    ) {}

    async execute(command: ExternalWithdrawRefund): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        const withdraw = await this.withdrawRepository.getByExternalContractId(command.contractId);
        if (!withdraw) {
            return;
        }

        withdraw.refunded();
        await this.withdrawRepository.save(withdraw);
    }
}
