import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { Injectable } from "@nestjs/common";
import ExternalDepositRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/ExternalDepositRedeem";
import RabbitMQ from "context/Queue/RabbitMQ";

@Injectable()
export default class ExternalDepositRedeemHandler implements UseCase<ExternalDepositRedeem, void> {
    constructor(private externalBlockchain: ExternalBlockchain, private rabbitMQ: RabbitMQ) {}

    async execute(command: ExternalDepositRedeem): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        await this.rabbitMQ.publish(this.rabbitMQ.EXTERNAL_DEPOSIT_CONTRACT_REDEEM, {
            txHash: command.txHash,
        });
    }
}
