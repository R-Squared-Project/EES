import { Command, CommandRunner, Option } from "nest-commander";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import ConfirmWithdrawInternalContractCreatedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreatedHandler";
import GetLastWithdrawContracts from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContracts";
import GetLastWithdrawContractsHandler from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContractsHandler";
import ConfirmWithdrawInternalContractCreated from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreated";
import { OperationType } from "context/InternalBlockchain/WithdrawTransactionsCollection";
import config from "context/config";

interface MonitorWithdrawInternalContractCreatedOptions {
    interval: number;
}

const REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_OPERATION_NAME = "revpop_last_processed_account_history_operation";

@Command({
    name: "monitor-withdraw-internal-contract-created",
    description: "Monitor Withdraw Internal Contract Created",
})
export class MonitorWithdrawInternalContractCreated extends CommandRunner {
    constructor(
        private readonly confirmWithdrawInternalContractCreateHandler: ConfirmWithdrawInternalContractCreatedHandler,
        private readonly getLastWithdrawContractsHandler: GetLastWithdrawContractsHandler
    ) {
        super();
    }

    async run(passedParam: string[], options: MonitorWithdrawInternalContractCreatedOptions): Promise<void> {
        await this.cycleProcess(options.interval);
    }

    @Option({
        flags: "-i, --interval [number]",
        description: "Launch interval (seconds)",
        defaultValue: config.worker.period,
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process() {
        const queryGetLastWithdrawContracts = new GetLastWithdrawContracts(
            REVPOP_LAST_PROCESSED_ACCOUNT_HISTORY_OPERATION_NAME,
            OperationType.Create
        );
        const withdrawTransactions = await this.getLastWithdrawContractsHandler.execute(queryGetLastWithdrawContracts);
        const errorHandler = new ErrorHandler("MonitorWithdrawInternalContractCreated");

        if (withdrawTransactions.transactions.length === 0) {
            return;
        }

        console.log(
            `MonitorWithdrawInternalContractCreated: Found ${withdrawTransactions.transactions.length} transactions to processed.`
        );

        for (const transaction of withdrawTransactions.transactions) {
            const query = new ConfirmWithdrawInternalContractCreated(transaction);

            try {
                await this.confirmWithdrawInternalContractCreateHandler.execute(query);
                console.log(
                    `MonitorWithdrawInternalContractCreated: Withdraw for transaction ${transaction.transactionId} created.`
                );
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
