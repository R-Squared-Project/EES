import {BlockTransactionString} from "web3-eth";
import Setting from "context/Setting/Setting";
import {UseCase} from "context/Core/Domain/UseCase";
import GetLastContracts from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContracts";
import config from "context/config";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Response from "./Response";
import * as Errors from "./Errors";

const ETH_LAST_BLOCK_NAME = 'eth_htlc_new_events_last_block'

interface Blocks {
    from: BlockTransactionString,
    to: BlockTransactionString
}

export default class GetLastContractsHandler implements UseCase<GetLastContracts, Response> {
    public constructor(
        private readonly externalBlockchain: ExternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastContracts): Promise<Response> {
        let blocks: Blocks
        if (query.blockNumber) {
            const block = await this.getBlock(query.blockNumber)
            blocks = {
                from: block,
                to: block
            }
        } else {
            blocks = await this.getBlocks()
        }

        const events = await this.externalBlockchain.repository.loadHTLCNewEvents(
            blocks.from.number,
            blocks.to.number
        )

        if (!query.blockNumber) {
            await this.setting.save(ETH_LAST_BLOCK_NAME, blocks.to.number)
        }

        return new Response(
            blocks.from.number, blocks.to.number, events
        )
    }

    private async getBlock(fromBlockNumber: number): Promise<BlockTransactionString> {
        const block = await this.externalBlockchain.repository.getBlock(fromBlockNumber)

        if (null === block) {
            throw new Errors.BlockNotExists(fromBlockNumber)
        }

        return block
    }

    private async getBlocks(): Promise<Blocks> {
        const lastProcessedBlockNumber = parseInt(await this.setting.load(ETH_LAST_BLOCK_NAME, config.eth.deploy_block_number), 10)
        const lastProcessedBlock = await this.externalBlockchain.repository.getBlock(lastProcessedBlockNumber) as BlockTransactionString

        const fromBlockNumber = lastProcessedBlockNumber + 1
        const fromBlock = await this.externalBlockchain.repository.getBlock(fromBlockNumber)

        if (null === fromBlock) {
            throw new Errors.BlockNotExists(fromBlockNumber)
        }

        const lastBlockNumber = await this.externalBlockchain.repository.getLastBlockNumber()
        const lastIrreversibleBlockNumber = lastBlockNumber - config.eth.required_block_confirmations

        if (lastIrreversibleBlockNumber <= lastProcessedBlockNumber) {
            throw new Errors.FromBlockLargerThanToBlock(lastProcessedBlockNumber, lastIrreversibleBlockNumber)
        }

        const toBlock = await this.externalBlockchain.repository.getBlock(lastIrreversibleBlockNumber)

        if (null === toBlock) {
            throw new Errors.BlockNotExists(lastIrreversibleBlockNumber)
        }

        if (lastProcessedBlock.hash === toBlock.hash) {
            throw new Errors.FromBlockHashEqualsToBlockHash(fromBlock.hash, fromBlock.number)
        }

        return {
            from: fromBlock,
            to: toBlock
        }
    }
}
