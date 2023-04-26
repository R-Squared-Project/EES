import { Command, CommandRunner, Option } from "nest-commander";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject } from "@nestjs/common";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import ConfirmWithdrawInternalContractCreatedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreatedHandler";
import GetLastDepositContracts from "context/Application/Query/InternalBlockchain/GetLastDepositContracts/GetLastDepositContracts";
import ConfirmDepositInternalContractCreated from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreated";
import GetLastWithdrawContracts from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContracts";
import GetLastWithdrawContractsHandler from "context/Application/Query/InternalBlockchain/GetLastWithdrawContracts/GetLastWithdrawContractsHandler";
import ConfirmWithdrawInternalContractCreated from "context/Application/Command/InternalBlockchain/ConfirmWithdrawInternalContractCreated/ConfirmWithdrawInternalContractCreated";

interface MonitorWithdrawInternalContractCreatedOptions {
    interval: number;
}

@Command({
    name: "monitor-withdraw-internal-contract-created",
    description: "Monitor Withdraw Internal Contract Created",
})
export class MonitorWithdrawInternalContractCreated extends CommandRunner {
    constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
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
        defaultValue: 10,
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process() {
        const queryGetLastWithdrawContracts = new GetLastWithdrawContracts();
        const withdrawInternalContracts = await this.getLastWithdrawContractsHandler.execute(
            queryGetLastWithdrawContracts
        );
        const errorHandler = new ErrorHandler("MonitorWithdrawInternalContractCreated");

        console.log(`Found ${withdrawInternalContracts.contracts.length} internal contracts to processed.`);

        for (const contract of withdrawInternalContracts.contracts) {
            const query = new ConfirmWithdrawInternalContractCreated(contract.message, contract.id);

            try {
                await this.confirmWithdrawInternalContractCreateHandler.execute(query);
                console.log(`Internal contract ${contract.id} created.`);
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
