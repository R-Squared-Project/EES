import {Command, CommandRunner} from "nest-commander";
import {Inject} from "@nestjs/common";
import EthereumRepository from "context/ExternalBlockchain/Repository/EthereumRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

@Command({
    name: "get-fee",
    description: "Get deposit fee",
})
export class GetFee extends CommandRunner {
    constructor(
        private readonly externalBlockchain: ExternalBlockchain
    ) {
        super();
    }


    async run(): Promise<void> {
        console.log(await this.externalBlockchain.getFee());
    }

}
