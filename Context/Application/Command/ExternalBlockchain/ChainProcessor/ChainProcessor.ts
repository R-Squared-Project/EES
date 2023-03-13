import ChainedHandlerInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerInterface";
import ChainedHandlerCommand from "context/Application/Command/ExternalBlockchain/ChainProcessor/ChainedHandlerCommand";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Setting from "context/Setting/Setting";
import {Injectable} from "@nestjs/common";
import IncomingContractsCreationsProcessingLink
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/IncomingContractsCreationsProcessingLink";

@Injectable()
export default class ChainProcessor {
    private handlers: ChainedHandlerInterface[] = []

     constructor(
         private readonly externalBlockchain: ExternalBlockchain,
         private setting: Setting,
         private incomingContractsCreationsProcessingLink: IncomingContractsCreationsProcessingLink
     ) {
        this.handlers.push(incomingContractsCreationsProcessingLink);
     }

    public async execute(range: ChainedHandlerCommand): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all(this.handlers.map((handler) => {
                try {
                    return handler.execute(range);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        console.log('Error in ', typeof handler, ': ', e.message);
                    }
                }

                return new Promise<void>((resolve) => {
                    resolve();
                })
            })).then(() => { resolve() }).catch(reject)
        })
    }

}
