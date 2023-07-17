import { Command, CommandRunner, Option } from "nest-commander";
import GetLastBlocks from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocks";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import * as GetLastBlocksErrors from "context/Application/Query/ExternalBlockchain/GetLastBlocks/Errors";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import GetLastBlockResponse from "context/Application/Query/ExternalBlockchain/GetLastBlocks/Response";
import AfterIncomingContractProcessed from "context/Subscribers/AfterIncomingContractProcessed";
import config from "context/config";

interface MonitorEthereumTransactionsOptions {
    blockNumber?: number;
    interval: number;
}

@Command({ name: "monitor-ethereum-transactions", description: "Monitor Ethereum Transactions" })
export class MonitorEthereumTransactions extends CommandRunner {
    constructor(private getLastBlocksHandler: GetLastBlocksHandler, private chainProcessor: ChainProcessor) {
        super();
    }

    async run(passedParam: string[], options: MonitorEthereumTransactionsOptions): Promise<void> {
        new AfterIncomingContractProcessed();
        if (!options?.blockNumber) {
            await this.cycleProcess(options.interval);
        } else {
            this.process(options.blockNumber).then(() => {
                process.exit();
            });
        }
    }

    @Option({
        flags: "-b, --block-number [number]",
        description: "Block to search",
    })
    parseBlockNumber(val: string): number {
        return Number(val);
    }

    @Option({
        flags: "-i, --interval [number]",
        description: "Launch interval (seconds)",
        defaultValue: config.worker.period,
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process(blockNumber: number | null) {
        const query = new GetLastBlocks(blockNumber);
        let result: GetLastBlockResponse;

        try {
            result = await this.getLastBlocksHandler.execute(query);

            console.log(`Found blocks from ${result.fromBlock} to ${result.toBlock}`);
            await this.chainProcessor.execute(new ChainedHandlerCommand(result.fromBlock, result.toBlock));
            await this.getLastBlocksHandler.saveLastBlockNumber(query, result.toBlock);
        } catch (e: unknown) {
            if (
                e instanceof GetLastBlocksErrors.BlockNotExists ||
                e instanceof GetLastBlocksErrors.FromBlockLargerThanToBlock ||
                e instanceof GetLastBlocksErrors.FromBlockHashEqualsToBlockHash
            ) {
                console.log("MonitorEthereumTransactions: ", e.message);
                return;
            }

            throw e;
        }
    }

    private cycleProcess(interval: number) {
        this.process(null).then(() => {
            setTimeout(() => {
                this.cycleProcess(interval);
            }, interval * 1000);
        });
    }
}
