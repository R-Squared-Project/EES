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
        const redeemOperations = await this.internalBlockchain.getRedeemOperations(deposit._depositRequest.revpopAccount.value)
        let isRedeemFound = false;

        for (const redeemOperation of redeemOperations) {
            if (redeemOperation.htlcContractId === internalContractId) {
                isRedeemFound = true;
                console.log(`Deposit ${deposit.idString} already redeemed.`);
            }
        }

        if (isRedeemFound) {
            return;
        }

        await this.internalBlockchain.burnAsset(parseInt(deposit._externalContract.value));
    }
}
