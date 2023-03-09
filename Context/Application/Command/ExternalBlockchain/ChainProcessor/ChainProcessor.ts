import ExternalBlockchainHandlerInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ExternalBlockchainHandlerInterface";
import BlockRange from "context/Application/Command/ExternalBlockchain/ChainProcessor/BlockRange";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import Setting from "context/Setting/Setting";
import {Injectable} from "@nestjs/common";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";

@Injectable()
export default class ChainProcessor {
    private handlers: ExternalBlockchainHandlerInterface[] = []

     constructor(
         private readonly externalBlockchain: ExternalBlockchain,
         private setting: Setting,
         private processIncomingContractCreationHandler: ProcessIncomingContractCreationHandler
     ) {
        this.handlers.push(processIncomingContractCreationHandler);
     }

    public async execute(range: BlockRange): Promise<void> {
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