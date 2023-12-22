import {Command, CommandRunner} from "nest-commander";
import {Inject} from "@nestjs/common";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";

@Command({
    name: "get-fee",
    description: "Get deposit fee",
})
export class GetFee extends CommandRunner {
    constructor(
        @Inject("ExternalBlockchainRepositoryInterface") private readonly ethereumRepository: EthereumRepository
    ) {
        super();
    }


    async run(): Promise<void> {
        console.log(await this.ethereumRepository.getFee());
    }

}
