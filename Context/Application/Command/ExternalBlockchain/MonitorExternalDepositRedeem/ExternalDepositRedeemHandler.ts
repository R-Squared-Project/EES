import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { Inject, Injectable } from "@nestjs/common";
import ExternalDepositRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/ExternalDepositRedeem";
import QueueInterface, { EXTERNAL_DEPOSIT_CONTRACT_REDEEM } from "context/Queue/QueueInterface";

@Injectable()
export default class ExternalDepositRedeemHandler implements UseCase<ExternalDepositRedeem, void> {
    constructor(
        private externalBlockchain: ExternalBlockchain,
        @Inject("QueueInterface") private rabbitMQ: QueueInterface
    ) {}

    async execute(command: ExternalDepositRedeem): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        await this.rabbitMQ.publish(EXTERNAL_DEPOSIT_CONTRACT_REDEEM, {
            txHash: command.txHash,
        });
    }
}
