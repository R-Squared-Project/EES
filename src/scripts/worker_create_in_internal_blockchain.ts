import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchainHandler";
import TypeOrmRepository from "context/Infrastructure/TypeORM/TypeOrmRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchain";
import Converter from "context/Infrastructure/Converter";
import RabbitMQ from "context/Queue/RabbitMQ";

const depositRepository = new TypeOrmRepository(DataSource)
const internalRepository = InternalBlockchain.init({
    repository: 'revpop'
})
const converter = new Converter()
const getLastContractsHandler = new CreateContractInInternalBlockchainHandler(depositRepository, internalRepository, converter)

interface CreateInInternalBlockchainMessage {
    deposit_id: string
}

async function main() {
    const messenger = new RabbitMQ()
    messenger.consume<CreateInInternalBlockchainMessage>(
        'create_in_internal_blockchain',
        async (message: CreateInInternalBlockchainMessage, ack) => {
            const query = new CreateContractInInternalBlockchain(message.deposit_id)

            try {
                await getLastContractsHandler.execute(query)
                // ack()
            } catch (e: unknown) {
                console.log(e)
                //TODO::nack?
            }
        }
    )
}

main()
