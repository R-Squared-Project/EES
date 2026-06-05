import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import TypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import RabbitMQ from "context/Queue/RabbitMQ";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import RedeemDepositExternalContract from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContract";
import RedeemDepositExternalContractHandler from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContractHandler";
import * as RedeemErrors from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/Errors";
import { RedeemExecutedInExternalBlockchainStatusError } from "context/Domain/Errors";

interface RedeemedInInternalBlockchainMessage {
    deposit_id: string;
}

/**
 * Errores que NUNCA se resuelven reintentando el mismo mensaje:
 * - Status inválido (el deposit ya transitó a otro estado, ej. 110 tras refund externo).
 * - Deposit inexistente (mensaje fantasma o BD desincronizada).
 * Para estos, ack() y drenar el mensaje en vez de requeue infinito.
 */
function isNonTransient(e: unknown): boolean {
    return (
        e instanceof RedeemExecutedInExternalBlockchainStatusError ||
        e instanceof RedeemErrors.DepositNotExists
    );
}

async function main() {
    const depositRepository = new TypeOrmRepository(DataSource);
    const externalBlockchain = new ExternalBlockchain("ethereum");
    const handler = new RedeemDepositExternalContractHandler(depositRepository, externalBlockchain);
    const messenger = new RabbitMQ();

    messenger.consume<RedeemedInInternalBlockchainMessage>(
        "deposit_redeemed_in_internal_blockchain",
        async (message: RedeemedInInternalBlockchainMessage, ack, nack) => {
            const command = new RedeemDepositExternalContract(message.deposit_id);

            try {
                await handler.execute(command);
                ack();
                console.log(
                    `WorkerRedeemInInternalBlockchain: HTLC contract redeemed in an external blockchain: ${message.deposit_id}`
                );
            } catch (e: unknown) {
                console.log("WorkerRedeemInInternalBlockchain: ", e);
                if (isNonTransient(e)) {
                    ack();
                    console.log(
                        `WorkerRedeemInInternalBlockchain: dropping non-transient message ${message.deposit_id}`
                    );
                } else {
                    nack();
                }
            }
        }
    );
}

main();
