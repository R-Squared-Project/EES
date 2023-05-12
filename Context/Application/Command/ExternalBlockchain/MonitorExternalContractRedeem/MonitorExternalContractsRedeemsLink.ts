import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import ExternalContractRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/ExternalContractRedeem";
import ExternalContractRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalContractRedeem/ExternalContractRedeemHandler";
import GetDepositLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastRedeemsHandler";

@Injectable()
export default class MonitorExternalContractsRedeemsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRedeemsHandler: GetDepositLastRedeemsHandler,
        private externalContractRedeemHandler: ExternalContractRedeemHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRedeemsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(`Process transaction ${event.transactionHash}`);

            try {
                const command = new ExternalContractRedeem(event.transactionHash, event.returnValues.contractId);
                await this.externalContractRedeemHandler.execute(command);
                console.log(`Redeem transaction ${event.transactionHash} successfully queued`);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log("Error in ", typeof this, ":", e.message);
                }
            }
        }
    }
}
