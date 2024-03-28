import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import ProcessWithdrawContractCreation from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreation";
import ProcessWithdrawContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreationHandler";
import GetWithdrawLastContractsHandler from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastContractsHandler";

@Injectable()
export default class WithdrawContractsCreationsProcessingLink implements ChainedHandlerInterface {
    constructor(
        private getLastContractsHandler: GetWithdrawLastContractsHandler,
        private processWithdrawContractCreationHandler: ProcessWithdrawContractCreationHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastContractsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(`WithdrawContractsCreationsProcessingLink: Process transaction ${event.transactionHash}`);

            try {
                const command = new ProcessWithdrawContractCreation(
                    event.returnValues.hashlock.replace("0x", ""),
                    event.transactionHash,
                    event.returnValues.contractId
                );
                await this.processWithdrawContractCreationHandler.execute(command);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log(
                        `WithdrawContractsCreationsProcessingLink: Error while processed transaction ${event.transactionHash}: `,
                        e.message
                    );
                    continue;
                }
            }

            console.log(
                `WithdrawContractsCreationsProcessingLink: Successfully added new transaction ${event.transactionHash}. `
            );
        }
    }
}
