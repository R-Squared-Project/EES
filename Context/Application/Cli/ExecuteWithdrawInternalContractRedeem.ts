import { Command, CommandRunner, Option } from "nest-commander";
import * as Errors from "context/Application/Command/InternalBlockchain/ProcessWithdrawInternalContractRedeem/Errors";
import { Inject } from "@nestjs/common";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import ProcessWithdrawInternalContractRedeemHandler from "context/Application/Command/InternalBlockchain/ProcessWithdrawInternalContractRedeem/ProcessWithdrawInternalContractRedeemHandler";
import ProcessWithdrawInternalContractRedeem from "context/Application/Command/InternalBlockchain/ProcessWithdrawInternalContractRedeem/ProcessWithdrawInternalContractRedeem";

interface ExecuteWithdrawInternalContractRedeemOptions {
    interval: number;
}

@Command({
    name: "execute-withdraw-internal-contract-redeem",
    description: "Execute Withdraw Internal Contract Redeem",
})
export class ExecuteWithdrawInternalContractRedeem extends CommandRunner {
    constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        private readonly withdrawInternalContractRedeemHandler: ProcessWithdrawInternalContractRedeemHandler
    ) {
        super();
    }

    async run(passedParam: string[], options: ExecuteWithdrawInternalContractRedeemOptions): Promise<void> {
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
        const errorHandler = new ErrorHandler("ProcessWithdrawInternalContractRedeem");
        try {
            const withdraws = await this.withdrawRepository.getByRedeemStatus();
            for (const withdraw of withdraws) {
                const command = new ProcessWithdrawInternalContractRedeem(withdraw.idString);
                try {
                    await this.withdrawInternalContractRedeemHandler.execute(command);
                } catch (e) {
                    errorHandler.handle(e);
                }
            }
        } catch (e: unknown) {
            if (e instanceof Errors.WithdrawNotFound) {
                console.log(e.message);
                return;
            }

            throw e;
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
