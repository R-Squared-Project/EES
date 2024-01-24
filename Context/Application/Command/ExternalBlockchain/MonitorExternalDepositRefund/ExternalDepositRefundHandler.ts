import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { Inject, Injectable } from "@nestjs/common";
import ExternalDepositRefund
    from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRefund/ExternalDepositRefund";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";

@Injectable()
export default class ExternalDepositRefundHandler implements UseCase<ExternalDepositRefund, void> {
    constructor(
        private externalBlockchain: ExternalBlockchain,
        @Inject("DepositRepositoryInterface") private depositRepository: DepositRepositoryInterface
    ) {}

    async execute(command: ExternalDepositRefund): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        const deposit = await this.depositRepository.getByContractId(command.contractId);
        if (!deposit) {
            return;
        }

        deposit.refundedInExternalBlockchain();
        await this.depositRepository.save(deposit);
    }
}
