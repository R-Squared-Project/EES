import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import ExternalWithdrawRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeemHandler";
import ExternalWithdrawRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeem";
import GetWithdrawLastRedeemsHandler from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastRedeemsHandler";

@Injectable()
export default class MonitorExternalWithdrawRedeemsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRedeemsHandler: GetWithdrawLastRedeemsHandler,
        private externalContractRedeemHandler: ExternalWithdrawRedeemHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRedeemsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(`Process withdraw transaction ${event.transactionHash}`);

            try {
                const command = new ExternalWithdrawRedeem(event.transactionHash, event.returnValues.contractId);
                await this.externalContractRedeemHandler.execute(command);
                console.log(`Redeem withdraw transaction ${event.transactionHash} successfully queued`);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log("Error in ", typeof this, ":", e.message);
                }
            }
        }
    }
}
