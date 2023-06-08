import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import GetWithdrawLastRefundsHandler from "context/Application/Query/ExternalBlockchain/GetWithdrawLastContractsEvents/GetWithdrawLastRefundsHandler";
import ExternalWithdrawRefundHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefundHandler";
import ExternalWithdrawRefund from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefund";

@Injectable()
export default class MonitorExternalWithdrawRefundsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRefundsHandler: GetWithdrawLastRefundsHandler,
        private externalContractRefundHandler: ExternalWithdrawRefundHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRefundsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(
                `MonitorExternalWithdrawRefundsLink: Process withdraw refund transaction ${event.transactionHash}`
            );

            try {
                const command = new ExternalWithdrawRefund(event.transactionHash, event.returnValues.contractId);
                await this.externalContractRefundHandler.execute(command);
                console.log(
                    `MonitorExternalWithdrawRefundsLink: Refund withdraw transaction ${event.transactionHash} successfully queued`
                );
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log("Error in ", typeof this, ":", e.message);
                }
            }
        }
    }
}
