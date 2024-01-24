import ChainedHandlerInterface from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";
import GetDepositLastRefundsHandler
    from "context/Application/Query/ExternalBlockchain/GetDepositLastContractsEvents/GetDepositLastRefundsHandler";
import ExternalDepositRefundHandler
    from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRefund/ExternalDepositRefundHandler";
import ExternalDepositRefund
    from "context/Application/Command/ExternalBlockchain/MonitorExternalDepositRefund/ExternalDepositRefund";

@Injectable()
export default class MonitorExternalDepositRefundsLink implements ChainedHandlerInterface {
    constructor(
        private getLastRefundsHandler: GetDepositLastRefundsHandler,
        private externalContractRefundHandler: ExternalDepositRefundHandler
    ) {}
    async execute(command: ChainedHandlerCommand): Promise<void> {
        const lastContracts = await this.getLastRefundsHandler.execute(command);
        for (const event of lastContracts.events) {
            console.log(
                `MonitorExternalDepositRefundsLink: Process deposit refund transaction ${event.transactionHash}`
            );

            try {
                const command = new ExternalDepositRefund(event.transactionHash, event.returnValues.contractId);
                await this.externalContractRefundHandler.execute(command);
                console.log(
                    `MonitorExternalDepositRefundsLink: Refund deposit transaction ${event.transactionHash} successfully queued`
                );
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log("Error in ", typeof this, ":", e.message);
                }
            }
        }
    }
}
