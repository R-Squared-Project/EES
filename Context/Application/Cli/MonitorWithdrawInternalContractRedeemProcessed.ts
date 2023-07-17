import { Command, CommandRunner, Option } from "nest-commander";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import { Inject } from "@nestjs/common";
import CheckInternalWithdrawalOperation from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperation";
import CheckInternalWithdrawalOperationHandler from "context/Application/Command/InternalBlockchain/CheckInternalWithdrawalOperation/CheckInternalWithdrawalOperationHandler";
import ConfirmWithdrawProcessedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessedHandler";
import ConfirmWithdrawProcessed from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessed";
import config from "context/config";

interface MonitorWithdrawInternalContractRedeemProcessedOptions {
    interval: number;
}

@Command({
    name: "monitor-withdraw-internal-contract-redeem-processed",
    description: "Monitor Withdraw Internal Contract Redeem Processed",
})
export class MonitorWithdrawInternalContractRedeemProcessed extends CommandRunner {
    constructor(
        private readonly confirmWithdrawProcessedHandler: ConfirmWithdrawProcessedHandler,
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface
    ) {
        super();
    }

    async run(passedParam: string[], options: MonitorWithdrawInternalContractRedeemProcessedOptions): Promise<void> {
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
        const withdraws = await this.withdrawRepository.getAllRedeemed();
        const errorHandler = new ErrorHandler("MonitorWithdrawInternalContractRedeemProcessed");

        if (withdraws.length === 0) {
            return;
        }

        console.log(
            `MonitorWithdrawInternalContractRedeemProcessed: Found redeemed withdraw transactions ${withdraws.length}.`
        );

        for (const withdraw of withdraws) {
            const query = new ConfirmWithdrawProcessed(withdraw);
            try {
                await this.confirmWithdrawProcessedHandler.execute(query);
                console.log(`MonitorWithdrawInternalContractRedeemProcessed: Withdraw ${withdraw.idString} processed.`);
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
