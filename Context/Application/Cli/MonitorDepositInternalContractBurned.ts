import { Command, CommandRunner, Option } from "nest-commander";
import * as Errors from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/Errors";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import { Inject } from "@nestjs/common";
import ErrorHandler from "context/Infrastructure/Errors/Handler";
import BurnedHandler from "context/Application/Command/InternalBlockchain/Confirm/Burned/BurnedHandler";
import Burned from "context/Application/Command/InternalBlockchain/Confirm/Burned/Burned";
import config from "context/config";

interface MonitorDepositInternalContractBurnedOptions {
    interval: number;
}

@Command({ name: "monitor-deposit-internal-contract-burned", description: "Monitor Deposit Internal Contract Burned" })
export class MonitorDepositInternalContractBurned extends CommandRunner {
    constructor(
        @Inject("DepositRepositoryInterface") private readonly depositRepository: DepositRepositoryInterface,
        private readonly burnedHandler: BurnedHandler
    ) {
        super();
    }

    async run(passedParam: string[], options: MonitorDepositInternalContractBurnedOptions): Promise<void> {
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
        const errorHandler = new ErrorHandler("MonitorDepositInternalContractBurned");
        try {
            const deposits = await this.depositRepository.getBurned();
            for (const deposit of deposits) {
                const command = new Burned(deposit.idString);
                try {
                    await this.burnedHandler.execute(command);
                } catch (e) {
                    errorHandler.handle(e);
                }
            }
        } catch (e: unknown) {
            if (e instanceof Errors.DepositNotFound) {
                errorHandler.handle(e);
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
