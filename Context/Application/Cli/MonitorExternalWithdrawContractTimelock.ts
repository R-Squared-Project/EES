import { Command, CommandRunner, Option } from "nest-commander";
import ConfirmWithdrawProcessedHandler from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessedHandler";
import { Inject } from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import ConfirmWithdrawProcessed from "context/Application/Command/InternalBlockchain/ConfirmWithdrawProcessed/ConfirmWithdrawProcessed";
import { ProcessWithdrawExternalContractRefundHandler } from "context/Application/Command/ExternalBlockchain/ProcessWithdrawExternalContractRefund/ProcessWithdrawExternalContractRefundHandler";
import { ProcessWithdrawExternalContractRefund } from "context/Application/Command/ExternalBlockchain/ProcessWithdrawExternalContractRefund/ProcessWithdrawExternalContractRefund";

interface MonitorExternalWithdrawContractTimelockOptions {
    interval: number;
}

@Command({
    name: "monitor-external-withdraw-contract-timelock-options",
    description: "Monitor External Withdraw Contract Timelock",
})
export class MonitorExternalWithdrawContractTimelock extends CommandRunner {
    constructor(
        private readonly processWithdrawExternalContractRefundHandler: ProcessWithdrawExternalContractRefundHandler,
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface
    ) {
        super();
    }

    async run(passedParam: string[], options: MonitorExternalWithdrawContractTimelockOptions): Promise<void> {
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
        const withdraws = await this.withdrawRepository.getAllReadyToRefund();
        const errorHandler = new ErrorHandler("MonitorWithdrawInternalContractRedeemProcessed");

        console.log(`Found withdraw transactions ${withdraws.length} for refund.`);

        for (const withdraw of withdraws) {
            const query = new ProcessWithdrawExternalContractRefund(withdraw);
            try {
                await this.processWithdrawExternalContractRefundHandler.execute(query);
                console.log(`Withdraw ${withdraw.idString} refunded.`);
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
