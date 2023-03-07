import Setting from "context/Setting/Setting";
import {UseCase} from "context/Core/Domain/UseCase";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Response from "./Response";
import BlockRange from "context/Application/Command/ExternalBlockchain/ChainProcessor/BlockRange";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class GetLastContractsHandler implements UseCase<BlockRange, Response> {
    public constructor(
        private readonly externalBlockchain: ExternalBlockchain
    ) {}

    public async execute(query: BlockRange): Promise<Response> {

        const events = await this.externalBlockchain.repository.loadHTLCNewEvents(
            query.fromBlock,
            query.toBlock
        )

        return new Response(
            query.fromBlock, query.toBlock, events
        )
    }
}
