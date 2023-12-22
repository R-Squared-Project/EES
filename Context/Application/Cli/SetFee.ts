import {Command, CommandRunner} from "nest-commander";
import {Inject} from "@nestjs/common";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";

@Command({
    name: "set-fee",
    description: "Set deposit fee",
})
export class SetFee extends CommandRunner {
    constructor(
        @Inject("ExternalBlockchainRepositoryInterface") private readonly ethereumRepository: EthereumRepository
    ) {
        super();
    }


    async run(): Promise<void> {
        await this.ethereumRepository.setFee(2);
    }

}
