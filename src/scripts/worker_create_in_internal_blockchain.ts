import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchainHandler";
import TypeOrmRepository from "context/Infrastructure/TypeORM/TypeOrmRepository";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchain";
import Converter from "context/Infrastructure/Converter";
import RabbitMQ from "context/Queue/RabbitMQ";

interface CreateInInternalBlockchainMessage {
    deposit_id: string
}

async function main() {
    const depositRepository = new TypeOrmRepository(DataSource)
    const internalBlockchain = await InternalBlockchain.init({
        repository: 'revpop'
    })
    const converter = new Converter()
    const handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter)
    const messenger = new RabbitMQ()

    messenger.consume<CreateInInternalBlockchainMessage>(
        'create_in_internal_blockchain',
        async (message: CreateInInternalBlockchainMessage, ack) => {
            const command = new CreateContractInInternalBlockchain(message.deposit_id)

            try {
                await handler.execute(command)
                ack()
                console.log(`HTLC contract submitted in an internal blockchain: ${message.deposit_id}`)
            } catch (e: unknown) {
                console.log(e)
                //TODO::nack?
            }
        }
    )
}

main()
