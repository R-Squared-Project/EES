import { Command, CommandRunner, Option } from 'nest-commander';
import * as Errors from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/Errors";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import {Inject} from "@nestjs/common";
import DepositInternalContractRefund
    from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/DepositInternalContractRefund";
import DepositInternalContractRefundHandler
    from "context/Application/Command/InternalBlockchain/DepositInternalContractRefund/DepositInternalContractRefundHandler";
import ErrorHandler from "context/Infrastructure/Errors/Handler";

interface MonitorDepositInternalContractRefundedOptions {
    interval: number;
}

@Command({ name: 'monitor-deposit-internal-contract-refunded', description: 'Monitor Deposit Internal Contract Refunded'})
export class MonitorDepositInternalContractRefunded extends CommandRunner {
    constructor(
        @Inject("DepositRepositoryInterface") private readonly depositRepository: DepositRepositoryInterface,
        private readonly depositInternalContractRefundHandler: DepositInternalContractRefundHandler,
    ) {
        super()
    }

    async run(
        passedParam: string[],
        options: MonitorDepositInternalContractRefundedOptions,
    ): Promise<void> {
        await this.cycleProcess(options.interval)
    }

    @Option({
        flags: '-i, --interval [number]',
        description: 'Launch interval (seconds)',
        defaultValue: 10
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process() {
        const errorHandler = new ErrorHandler('MonitorDepositInternalContractRefunded');
        try {
            const deposits = await this.depositRepository.getOverdueTimeLock();
            for (const deposit of deposits) {
                const command = new DepositInternalContractRefund(deposit.idString)
                try {
                    await this.depositInternalContractRefundHandler.execute(command)
                } catch (e) {
                    errorHandler.handle(e)
                }
            }
        } catch (e: unknown) {
            if (e instanceof Errors.DepositNotFound) {
                console.log(e.message)
                return
            }

            throw e
        }
    }

    private cycleProcess(interval: number) {
        this.process()
            .then(() => {
                setTimeout(() => {
                    this.cycleProcess(interval);
                }, interval * 1000)
            });

    }
}
