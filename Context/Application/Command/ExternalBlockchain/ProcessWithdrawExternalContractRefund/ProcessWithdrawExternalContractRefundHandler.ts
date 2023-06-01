import { UseCase } from "context/Core/Domain/UseCase";
import ConfirmWithdrawProcessed from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessed";
import { Inject } from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Setting from "context/Setting/Setting";
import NotifierInterface from "context/Notifier/NotifierInterface";
import { ProcessWithdrawExternalContractRefund } from "context/Application/Command/ExternalBlockchain/ProcessWithdrawExternalContractRefund/ProcessWithdrawExternalContractRefund";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

export class ProcessWithdrawExternalContractRefundHandler implements UseCase<ConfirmWithdrawProcessed, void> {
    public constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("ExternalBlockchain") private readonly externalBlockchain: ExternalBlockchain,
        private readonly setting: Setting,
        @Inject("NotifierInterface") private readonly notifier: NotifierInterface
    ) {}

    public async execute(command: ProcessWithdrawExternalContractRefund): Promise<void> {
        const externalContract = await this.externalBlockchain.loadWithdrawContract(
            command.withdraw.externalContract?.txHash ?? "",
            command.withdraw.externalContract?.idString ?? ""
        );

        if (externalContract?.withdrawn) {
            return;
        }

        const txHash = await this.externalBlockchain.refund(externalContract?.contractId ?? "");
        command.withdraw.refund(txHash);
        this.withdrawRepository.save(command.withdraw);
    }
}
