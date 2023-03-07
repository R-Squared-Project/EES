import { Command, CommandRunner, Option } from 'nest-commander';
import GetLastBlocks from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocks";
import BlockRange from "context/Application/Command/ExternalBlockchain/ChainProcessor/BlockRange";
import * as GetLastBlocksErrors from "context/Application/Query/ExternalBlockchain/GetLastBlocks/Errors";
import GetLastBlocksHandler from "context/Application/Query/ExternalBlockchain/GetLastBlocks/GetLastBlocksHandler";
import ChainProcessor from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainProcessor";

interface MonitorEthereumTransactionsOptions {
    blockNumber?: number;
    interval: number;
}

@Command({ name: 'monitor-ethereum-transactions', description: 'Monitor Ethereum Transactions' })
export class MonitorEthereumTransactions extends CommandRunner {
    constructor(
        private getLastBlocksHandler: GetLastBlocksHandler,
        private chainProcessor: ChainProcessor
    ) {
        super()
    }

    async run(
        passedParam: string[],
        options: MonitorEthereumTransactionsOptions,
    ): Promise<void> {
        if (!options?.blockNumber) {
            setInterval(this.process.bind(this), options.interval * 1000)
        } else {
            this.process(options.blockNumber).then(() => {
                process.exit()
            })
        }
    }

    @Option({
        flags: '-b, --block-number [number]',
        description: 'Block to search',
    })
    parseBlockNumber(val: string): number {
        return Number(val);
    }

    @Option({
        flags: '-i, --interval [number]',
        description: 'Launch interval (seconds)',
        defaultValue: 10
    })
    parseInterval(val: string): number {
        return Number(val);
    }

    private async process(blockNumber: number) {
        const query = new GetLastBlocks(blockNumber);
        let result: BlockRange

        try {
            result = await this.getLastBlocksHandler.execute(query)

            console.log(`Found blocks from ${result.fromBlock} to ${result.toBlock}`);
            await this.chainProcessor.execute(result);
        } catch (e: unknown) {
            if (e instanceof GetLastBlocksErrors.BlockNotExists ||
                e instanceof GetLastBlocksErrors.FromBlockLargerThanToBlock ||
                e instanceof GetLastBlocksErrors.FromBlockHashEqualsToBlockHash) {
                console.log(e.message)
                return
            }

            throw e
        }
    }
}