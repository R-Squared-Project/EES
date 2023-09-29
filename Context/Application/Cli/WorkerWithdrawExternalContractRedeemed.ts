import { Command, CommandRunner } from "nest-commander";
import { PersistentError } from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";
import ConfirmWithdrawExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemed";
import ConfirmWithdrawExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemedHandler";
import QueueInterface, { EXTERNAL_WITHDRAW_CONTRACT_REDEEM } from "context/Queue/QueueInterface";
import { Inject } from "@nestjs/common";

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
        @Inject("QueueInterface") private readonly messenger: QueueInterface,
        private readonly handler: ConfirmWithdrawExternalContractRedeemedHandler
    ) {
        super();
    }

    async run(passedParam: string[]): Promise<void> {
        this.messenger.consume<WithdrawExternalContractRedeemedMessage>(
            EXTERNAL_WITHDRAW_CONTRACT_REDEEM,
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
