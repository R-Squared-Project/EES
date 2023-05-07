import { Command, CommandRunner, Option } from "nest-commander";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject } from "@nestjs/common";
import CheckInternalWithdrawalOperation from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperation";
import CheckInternalWithdrawalOperationHandler from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperationHandler";
import AfterWithdrawReadyToProcess from "context/Subscribers/AfterWithdrawReadyToProcess";

interface FoundWithdrawInternalContractCreationOptions {
    interval: number;
}

@Command({
    name: "found-withdraw-internal-contract-creation",
    description: "Found Withdraw Internal Contract Creation",
})
export class FoundWithdrawInternalContractCreation extends CommandRunner {
    constructor(
        private readonly checkInternalWithdrawalOperationHandler: CheckInternalWithdrawalOperationHandler,
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface
    ) {
        super();
    }

    async run(passedParam: string[], options: FoundWithdrawInternalContractCreationOptions): Promise<void> {
        new AfterWithdrawReadyToProcess();
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
        const withdraws = await this.withdrawRepository.getAllForCheck();
        const errorHandler = new ErrorHandler("FoundWithdrawInternalContractCreation");

        console.log(`Found ${withdraws.length} transactions to processed.`);

        for (const withdraw of withdraws) {
            const query = new CheckInternalWithdrawalOperation(withdraw);

            try {
                await this.checkInternalWithdrawalOperationHandler.execute(query);
                console.log(`Withdraw ${withdraw.idString} processed.`);
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
