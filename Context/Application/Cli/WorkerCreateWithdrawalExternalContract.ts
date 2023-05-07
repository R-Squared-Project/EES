import { Command, CommandRunner, Option } from "nest-commander";
import ConfirmWithdrawInternalContractCreatedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreatedHandler";
import GetLastWithdrawContractsHandler from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContractsHandler";
import RedeemDepositExternalContract from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContract";
import RabbitMQ from "context/Queue/RabbitMQ";

interface CreateWithdrawalExternalContractMessage {
    withdraw_id: string;
}

@Command({
    name: "worker-create-withdrawal-external-contract",
    description: "Worker Create Withdrawal External Contract",
})
export class WorkerCreateWithdrawalExternalContract extends CommandRunner {
    constructor(
        private readonly messenger: RabbitMQ,
        private readonly confirmWithdrawInternalContractCreateHandler: ConfirmWithdrawInternalContractCreatedHandler,
        private readonly getLastWithdrawContractsHandler: GetLastWithdrawContractsHandler
    ) {
        super();
    }

    async run(passedParam: string[]): Promise<void> {
        this.messenger.consume<CreateWithdrawalExternalContractMessage>(
            this.messenger.WITHDRAW_READY_TO_PROCESS,
            async (message: CreateWithdrawalExternalContractMessage, ack) => {
                const command = new RedeemDepositExternalContract(message.withdraw_id);

                try {
                    await handler.execute(command);
                    ack();
                    console.log(`HTLC contract redeemed in an external blockchain: ${message.deposit_id}`);
                } catch (e: unknown) {
                    console.log(e);
                    //TODO::nack?
                }
            }
        );
    }
}
