import { Command, CommandRunner } from "nest-commander";
import RabbitMQ from "context/Queue/RabbitMQ";
import ConfirmDepositExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/ConfirmDepositExternalContractRedeemed";
import ConfirmDepositExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/ConfirmDepositExternalContractRedeemedHandler";
import QueueInterface, { EXTERNAL_DEPOSIT_CONTRACT_REDEEM } from "context/Queue/QueueInterface";
import { Inject } from "@nestjs/common";

interface ExternalContractRedeemMessage {
    txHash: string;
}

@Command({
    name: "worker-external-contract-redeem",
    description: "Consume RabbitMQ message to confirm deposit external contract redeemed",
})
export class ExternalContractRedeemWorker extends CommandRunner {
    constructor(
        @Inject("QueueInterface") private queue: QueueInterface,
        private handler: ConfirmDepositExternalContractRedeemedHandler
    ) {
        super();
    }

    async run(): Promise<void> {
        this.queue.consume<ExternalContractRedeemMessage>(
            EXTERNAL_DEPOSIT_CONTRACT_REDEEM,
            async (message: ExternalContractRedeemMessage, ack, nack) => {
                const command = new ConfirmDepositExternalContractRedeemed(message.txHash);

                try {
                    await this.handler.execute(command);
                    ack();
                    console.log(
                        `Redeem of HTLC contract with txHash ${message.txHash} confirmed in an external blockchain.`
                    );
                } catch (e: unknown) {
                    nack();
                    const errorMessage = (e as Error).message;

                    console.log(
                        `Error occurred while confirming redeem of HTLC contract with txHash ${message.txHash}: ${errorMessage}.`
                    );
                }
            }
        );
    }
}
