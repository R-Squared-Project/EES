import { Command, CommandRunner, Option } from "nest-commander";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import config from "context/config";
import ExecuteRefundedWithdrawInternalContractBurn
    from "context/Application/Command/InternalBlockchain/ExecuteRefundedWithdrawInternalContractBurn/ExecuteRefundedWithdrawInternalContractBurn";
import ExecuteRefundedWithdrawInternalContractBurnHandler
    from "context/Application/Command/InternalBlockchain/ExecuteRefundedWithdrawInternalContractBurn/ExecuteRefundedWithdrawInternalContractBurnHandler";
import {Inject} from "@nestjs/common";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";

interface ExecuteWithdrawInternalContractRefundOptions {
    interval: number;
}

@Command({
    name: "execute-withdraw-internal-contract-refund",
    description: "Execute Withdraw Internal Contract Refund",
})
export class ExecuteWithdrawInternalContractRefund extends CommandRunner {
    constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        private readonly executeRefundedWithdrawInternalContractBurnHandler: ExecuteRefundedWithdrawInternalContractBurnHandler
    ) {
        super();
    }

    async run(passedParam: string[], options: ExecuteWithdrawInternalContractRefundOptions): Promise<void> {
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
        const withdraws = await this.withdrawRepository.getAllRefundedReadyToBurn();

        if (withdraws.length === 0) {
            return;
        }

        console.log(
            `ExecuteWithdrawInternalContractRefund: Found ${withdraws.length} transactions to processed.`
        );


        const errorHandler = new ErrorHandler("ExecuteWithdrawInternalContractRefund");

        for (const withdraw of withdraws) {
            const query = new ExecuteRefundedWithdrawInternalContractBurn(withdraw);

            try {
                await this.executeRefundedWithdrawInternalContractBurnHandler.execute(query);
                console.log(
                    `ExecuteWithdrawInternalContractRefund: Withdraw ID: ${withdraw.idString} transaction fee burned.`
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
