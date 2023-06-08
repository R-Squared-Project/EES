import { Command, CommandRunner } from "nest-commander";
import RabbitMQ from "context/Queue/RabbitMQ";
import { PersistentError } from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";
import ConfirmWithdrawExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemed";
import ConfirmWithdrawExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemedHandler";

interface WithdrawExternalContractRedeemedMessage {
    txHash: string;
    contractId: string;
}

@Command({
    name: "worker-withdraw-external-contract-redeemed",
    description: "Worker to Confirm Withdraw External Contract Redeemed",
})
export class WorkerWithdrawExternalContractRedeemed extends CommandRunner {
    constructor(
        private readonly messenger: RabbitMQ,
        private readonly handler: ConfirmWithdrawExternalContractRedeemedHandler
    ) {
        super();
    }

    async run(passedParam: string[]): Promise<void> {
        this.messenger.consume<WithdrawExternalContractRedeemedMessage>(
            this.messenger.EXTERNAL_WITHDRAW_CONTRACT_REDEEM,
            async (message: WithdrawExternalContractRedeemedMessage, ack, nack) => {
                const command = new ConfirmWithdrawExternalContractRedeemed(message.txHash, message.contractId);

                try {
                    await this.handler.execute(command);
                    ack();
                    console.log(
                        `WorkerWithdrawExternalContractRedeemed: HTLC contract ${message.contractId} redeemed in an external blockchain`
                    );
                } catch (e: unknown) {
                    const errorMessage = (e as Error).message;
                    console.log("WorkerWithdrawExternalContractRedeemed: ", errorMessage);
                    if (e instanceof PersistentError) {
                        ack();
                    } else {
                        nack();
                    }
                }
            }
        );
    }
}
