import {UseCase} from "context/Core/Domain/UseCase";
import Burned from "./Burned";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors"

export default class BurnedHandler implements UseCase<Burned, void> {
    constructor(
        private repository: DepositRepositoryInterface,
        private internalBlockchain: InternalBlockchain
    ) {}

    async execute(command: Burned): Promise<void> {
        const deposit = await this.repository.getById(command.depositId)

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId)
        }

        const internalContractId = deposit.internalContract?.internalId as string
        const burnOperations = await this.internalBlockchain.getBurnOperations(deposit._depositRequest.revpopAccount.value)

        for (const burnOperation of burnOperations) {
            if (burnOperation.htlcContractId === internalContractId) {
                deposit.refunded(burnOperation.txHash)
                await this.repository.save(deposit)
                console.log(`Deposit ${deposit.idString} assets burned.`);
            }
        }
    }
}
