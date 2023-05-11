import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import GetLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastContractsHandler";
import { Injectable } from "@nestjs/common";
import ProcessWithdrawContractCreation from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreation";
import ProcessWithdrawContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreationHandler";

@Injectable()
export default class WithdrawContractsCreationsProcessingLink implements ChainedHandlerInterface {
    constructor(
        private getLastContractsHandler: GetLastContractsHandler,
        private processWithdrawContractCreationHandler: ProcessWithdrawContractCreationHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastContractsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(`Process transaction ${event.transactionHash}`);

            try {
                const command = new ProcessWithdrawContractCreation(
                    event.transactionHash,
                    event.returnValues.contractId
                );
                await this.processWithdrawContractCreationHandler.execute(command);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log(`Error while processed transaction ${event.transactionHash}: `, e.message);
                    continue;
                }
            }

            console.log(`Successfully added new transaction ${event.transactionHash}. `);
        }
    }
}
