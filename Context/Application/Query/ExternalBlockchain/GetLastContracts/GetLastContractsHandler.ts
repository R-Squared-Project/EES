import Setting from "context/Setting/Setting";
import {UseCase} from "context/Core/Domain/UseCase";
import GetLastContracts from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContracts";
import config from "context/config";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Response from "./Response";

const ETH_LAST_BLOCK_NAME = 'eth_last_block'

export default class GetLastContractsHandler implements UseCase<GetLastContracts, Response> {
    public constructor(
        private readonly externalBlockchain: ExternalBlockchain,
        private setting: Setting
    ) {}

    public async execute(query: GetLastContracts): Promise<Response> {
        const fromBlock = query.blockNumber ?? await this.fromBlock()
        const toBlock = query.blockNumber ?? await this.toBlock()

        const events = await this.externalBlockchain.repository.loadEvents(fromBlock, toBlock)

        if (!query.blockNumber) {
            await this.setting.save(ETH_LAST_BLOCK_NAME, toBlock)
        }

        return new Response(
            fromBlock, toBlock, events
        )
    }

    private async fromBlock(): Promise<number> {
        return await this.setting.load(ETH_LAST_BLOCK_NAME, config.eth.deploy_block_number) as number
    }

    private async toBlock(): Promise<number> {
        const lastBlockNumber = await this.externalBlockchain.repository.getLastBlockNumber()

        return lastBlockNumber - config.eth.required_block_confirmations
    }
}
