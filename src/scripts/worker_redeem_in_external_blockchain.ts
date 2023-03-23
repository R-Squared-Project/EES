import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import RabbitMQ from "context/Queue/RabbitMQ";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import RedeemDepositExternalContract
    from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContract";
import RedeemDepositExternalContractHandler
    from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContractHandler";

interface RedeemedInInternalBlockchainMessage {
    deposit_id: string
}

async function main() {
    const depositRepository = new TypeOrmRepository(DataSource)
    const externalBlockchain = new ExternalBlockchain('ethereum')
    const handler = new RedeemDepositExternalContractHandler(depositRepository, externalBlockchain)
    const messenger = new RabbitMQ()

    messenger.consume<RedeemedInInternalBlockchainMessage>(
        'deposit_redeemed_in_internal_blockchain',
        async (message: RedeemedInInternalBlockchainMessage, ack) => {
            const command = new RedeemDepositExternalContract(message.deposit_id)

            try {
                await handler.execute(command)
                ack()
                console.log(`HTLC contract redeemed in an external blockchain: ${message.deposit_id}`)
            } catch (e: unknown) {
                console.log(e)
                //TODO::nack?
            }
        }
    )
}

main()
