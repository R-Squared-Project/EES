import ChainedHandlerInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import AfterIncomingContractProcessed from "context/Subscribers/AfterIncomingContractProcessed";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class IncomingContractsCreationsProcessingLink implements ChainedHandlerInterface {
    constructor(
        private getLastContractsHandler: GetLastContractsHandler,
        private processIncomingContractCreationHandler: ProcessIncomingContractCreationHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        new AfterIncomingContractProcessed();
        const lastContracts = await this.getLastContractsHandler.execute(command)
        for (const event of lastContracts.events) {
            console.log(`Process transaction ${event.transactionHash}`)

            try {
                const command = new ProcessIncomingContractCreation(event.transactionHash, event.returnValues.contractId);
                await this.processIncomingContractCreationHandler.execute(command)
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log('Error in ', typeof this, ':', e.message);
                }
            }
        }
    }

}
