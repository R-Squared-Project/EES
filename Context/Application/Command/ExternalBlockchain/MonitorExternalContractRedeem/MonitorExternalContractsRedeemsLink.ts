import ChainedHandlerInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import AfterIncomingContractProcessed from "context/Subscribers/AfterIncomingContractProcessed";
import {Injectable} from "@nestjs/common";
import GetLastRedeemsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContractsEvents/GetLastRedeemsHandler";

@Injectable()
export default class MonitorExternalContractsRedeemsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRedeemsHandler: GetLastRedeemsHandler,
        private processIncomingContractCreationHandler: ProcessIncomingContractCreationHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRedeemsHandler.execute(command)
        for (const event of lastContracts.events) {
            console.log(`Process transaction ${event.transactionHash}`)
            console.log('EVENT', event)

            // try {
            //     const command = new ProcessIncomingContractCreation(event.transactionHash, event.returnValues.contractId);
            //     await this.processIncomingContractCreationHandler.execute(command)
            // } catch (e: unknown) {
            //     if (e instanceof Error) {
            //         console.log('Error in ', typeof this, ':', e.message);
            //     }
            // }
        }
    }

}
