import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import ExternalDepositRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/ExternalDepositRedeem";
import ExternalDepositRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRedeem/ExternalDepositRedeemHandler";
import GetDepositLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastRedeemsHandler";

@Injectable()
export default class MonitorExternalDepositRedeemsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRedeemsHandler: GetDepositLastRedeemsHandler,
        private externalContractRedeemHandler: ExternalDepositRedeemHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRedeemsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(`MonitorExternalDepositRedeemsLink: Process transaction ${event.transactionHash}`);

            try {
                const command = new ExternalDepositRedeem(event.transactionHash, event.returnValues.contractId);
                await this.externalContractRedeemHandler.execute(command);
                console.log(
                    `MonitorExternalDepositRedeemsLink: Redeem deposit transaction ${event.transactionHash} successfully queued`
                );
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log("Error in ", typeof this, ":", e.message);
                }
            }
        }
    }
}
