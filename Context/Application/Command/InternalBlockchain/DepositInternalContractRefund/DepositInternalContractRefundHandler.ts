import {UseCase} from "context/Core/Domain/UseCase";
import DepositInternalContractRefund from "./DepositInternalContractRefund";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors"

export default class DepositInternalContractRefundHandler implements UseCase<DepositInternalContractRefund, void> {
    constructor(
        private repository: DepositRepositoryInterface,
        private internalBlockchain: InternalBlockchain
    ) {}

    async execute(command: DepositInternalContractRefund): Promise<void> {
        const deposit = await this.repository.getById(command.depositId)

        if (deposit === null) {

            throw new Errors.DepositNotFound(command.depositId)
        }

        const internalContractId = deposit.internalContract?.internalId as string

        if(!await this.hasRefundOperation(internalContractId, deposit._depositRequest.revpopAccount.value)) {
            console.log(`Deposit ${deposit.idString} has not refund yet.`)

            return;
        }

        console.log(`Deposit ${deposit.idString} has refund.`);

        await this.internalBlockchain.burnAsset(parseInt(deposit._externalContract.value));
    }

    private async hasRefundOperation(internalContractId: string, accountName: string): Promise<boolean> {
        const refundOperations = await this.internalBlockchain.getRefundOperations(accountName)

        for (const refundOperation of refundOperations) {
            if (refundOperation.htlcContractId === internalContractId) {

                return true;
            }
        }

        return false;
    }
}
