import {UseCase} from "context/Core/Domain/UseCase";
import ConfirmDepositInternalContractRedeemed from "./ConfirmDepositInternalContractRedeemed";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors"

export default class ConfirmDepositInternalContractRedeemedHandler implements UseCase<ConfirmDepositInternalContractRedeemed, void> {
    constructor(
        private repository: DepositRepositoryInterface,
        private internalBlockchain: InternalBlockchain
    ) {}

    async execute(command: ConfirmDepositInternalContractRedeemed): Promise<void> {
        const deposit = await this.repository.getById(command.depositId)

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId)
        }

        const internalContractId = deposit.internalContract?.internalId as string
        const redeemOperations = await this.internalBlockchain.getRedeemOperations(deposit._depositRequest.revpopAccount.value)

        for (const redeemOperation of redeemOperations) {
            if (redeemOperation.htlcContractId === internalContractId) {
                deposit.redeemedInInternalBlockchain(redeemOperation.secret)
                await this.repository.save(deposit)
                console.log(`Deposit ${deposit.idString} redeemed.`);
            }
        }
    }
}
