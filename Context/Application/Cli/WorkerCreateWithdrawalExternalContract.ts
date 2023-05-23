import { Command, CommandRunner } from "nest-commander";
import RabbitMQ from "context/Queue/RabbitMQ";
import CreateWithdrawalExternalContract from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/CreateWithdrawalExternalContract";
import CreateWithdrawalExternalContractHandler from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/CreateWithdrawalExternalContractHandler";
import { PersistentError } from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";

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
        private readonly handler: CreateWithdrawalExternalContractHandler
    ) {
        super();
    }

    async run(passedParam: string[]): Promise<void> {
        this.messenger.consume<CreateWithdrawalExternalContractMessage>(
            this.messenger.WITHDRAW_READY_TO_PROCESS,
            async (message: CreateWithdrawalExternalContractMessage, ack, nack) => {
                const command = new CreateWithdrawalExternalContract(message.withdraw_id);

                try {
                    await this.handler.execute(command);
                    ack();
                    console.log(`HTLC contract created in an external blockchain: ${message.withdraw_id}`);
                } catch (e: unknown) {
                    console.log(e);

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
