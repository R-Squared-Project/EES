import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import ProcessIncomingContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ProcessIncomingContractCreation from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import { Injectable } from "@nestjs/common";
import GetDepositLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastContractsHandler";

@Injectable()
export default class IncomingContractsCreationsProcessingLink implements ChainedHandlerInterface {
    constructor(
        private getLastContractsHandler: GetDepositLastContractsHandler,
        private processIncomingContractCreationHandler: ProcessIncomingContractCreationHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastContractsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(
                `Deposit IncomingContractsCreationsProcessingLink: Process transaction ${event.transactionHash}`
            );

            try {
                const command = new ProcessIncomingContractCreation(
                    event.transactionHash,
                    event.returnValues.contractId
                );
                await this.processIncomingContractCreationHandler.execute(command);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log(
                        `Deposit IncomingContractsCreationsProcessingLink: Error while processed transaction ${event.transactionHash}: `,
                        e.message
                    );
                    continue;
                }
            }

            console.log(
                `Deposit IncomingContractsCreationsProcessingLink: Successfully added new transaction ${event.transactionHash}. `
            );
        }
    }
}
