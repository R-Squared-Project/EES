import { Command, CommandRunner, Option } from "nest-commander";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import GetLastWithdrawContracts from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContracts";
import GetLastWithdrawContractsHandler from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContractsHandler";
import ConfirmWithdrawInternalContractCreated from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreated";
import ConfirmWithdrawInternalContractRedeemHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractRedeem/ConfirmWithdrawInternalContractRedeemHandler";
import ConfirmWithdrawInternalContractRedeem from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractRedeem/ConfirmWithdrawInternalContractRedeem";

interface MonitorWithdrawInternalContractRedeemOptions {
    interval: number;
}

const REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_WITHDRAW_REDEEM_OPERATION_NAME =
    "revpop_last_processed_account_history_withdraw_redeem_operation";

@Command({
    name: "monitor-withdraw-internal-contract-redeem",
    description: "Monitor Withdraw Internal Contract Redeem",
})
export class MonitorWithdrawInternalContractRedeem extends CommandRunner {
    constructor(
        private readonly confirmWithdrawInternalContractRedeemHandler: ConfirmWithdrawInternalContractRedeemHandler,
        private readonly getLastWithdrawContractsHandler: GetLastWithdrawContractsHandler
    ) {
        super();
    }

    async run(passedParam: string[], options: MonitorWithdrawInternalContractRedeemOptions): Promise<void> {
        await this.cycleProcess(options.interval);
    }

    @Option({
        flags: "-i, --interval [number]",
        description: "Launch interval (seconds)",
        defaultValue: 10,
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process() {
        const queryGetLastWithdrawContracts = new GetLastWithdrawContracts(
            REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_WITHDRAW_REDEEM_OPERATION_NAME
        );
        const withdrawTransactions = await this.getLastWithdrawContractsHandler.execute(queryGetLastWithdrawContracts);
        const errorHandler = new ErrorHandler("MonitorWithdrawInternalContractRedeem");

        console.log(`Found ${withdrawTransactions.transactions.length} transactions to processed.`);

        for (const transaction of withdrawTransactions.transactions) {
            const query = new ConfirmWithdrawInternalContractRedeem(transaction);

            try {
                await this.confirmWithdrawInternalContractRedeemHandler.execute(query);
                console.log(`Withdraw for transaction ${transaction.transactionId} redeemed.`);
            } catch (e) {
                errorHandler.handle(e);
            }
        }
    }

    private cycleProcess(interval: number) {
        this.process().then(() => {
            setTimeout(() => {
                this.cycleProcess(interval);
            }, interval * 1000);
        });
    }
}
