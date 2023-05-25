import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { Injectable } from "@nestjs/common";
import RabbitMQ from "context/Queue/RabbitMQ";
import ExternalWithdrawRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeem";

@Injectable()
export default class ExternalWithdrawRedeemHandler implements UseCase<ExternalWithdrawRedeem, void> {
    constructor(private externalBlockchain: ExternalBlockchain, private rabbitMQ: RabbitMQ) {}

    async execute(command: ExternalWithdrawRedeem): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        await this.rabbitMQ.publish(this.rabbitMQ.EXTERNAL_WITHDRAW_CONTRACT_REDEEM, {
            txHash: command.txHash,
        });
    }
}
