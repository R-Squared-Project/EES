import { UseCase } from "context/Core/Domain/UseCase";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Response from "./Response";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class GetDepositLastContractsHandler implements UseCase<ChainedHandlerCommand, Response> {
    public constructor(private readonly externalBlockchain: ExternalBlockchain) {}

    public async execute(query: ChainedHandlerCommand): Promise<Response> {
        const events = await this.externalBlockchain.repository.loadDepositHTLCNewEvents(
            query.fromBlock,
            query.toBlock
        );

        return new Response(query.fromBlock, query.toBlock, events);
    }
}
