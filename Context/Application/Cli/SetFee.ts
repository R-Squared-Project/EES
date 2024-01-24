import {Command, CommandRunner} from "nest-commander";
import {Inject} from "@nestjs/common";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";

@Command({
    name: "set-fee",
    arguments: "<fee>",
    description: "Set deposit fee",
})
export class SetFee extends CommandRunner {
    constructor(
        @Inject("ExternalBlockchainRepositoryInterface") private readonly ethereumRepository: EthereumRepository
    ) {
        super();
    }


    async run(passedParam: string[]): Promise<void> {
        await this.ethereumRepository.setFee(parseInt(passedParam[0]));
        console.log("Fee set");
    }

}
