import {UseCase} from "context/Core/Domain/UseCase";
import GetLastContracts from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContracts";
import config from "context/config";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Response from "./Response";

export default class GetLastContractsHandler implements UseCase<GetLastContracts, Response> {
    public constructor(
        private readonly externalBlockchain: ExternalBlockchain
    ) {}

    public async execute(query: GetLastContracts): Promise<Response> {
        const fromBlock = query.blockNumber ?? this.fromBlock()
        const toBlock = query.blockNumber ?? await this.toBlock()

        const events = await this.externalBlockchain.repository.loadEvents(fromBlock, toBlock)

        return new Response(
            fromBlock, toBlock, events
        )
    }

    private fromBlock(): number {
        return config.eth.deploy_block_number
    }

    private async toBlock(): Promise<number> {
        const lastBlockNumber = await this.externalBlockchain.repository.getLastBlockNumber()

        return lastBlockNumber - config.eth.required_block_confirmations
    }
}
