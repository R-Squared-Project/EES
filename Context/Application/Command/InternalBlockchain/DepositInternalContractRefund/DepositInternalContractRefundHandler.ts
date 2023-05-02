import { UseCase } from "context/Core/Domain/UseCase";
import DepositInternalContractRefund from "./DepositInternalContractRefund";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors";
import { Inject, Injectable } from "@nestjs/common";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import ConverterInterface from "context/Domain/ConverterInterface";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

@Injectable()
export default class DepositInternalContractRefundHandler implements UseCase<DepositInternalContractRefund, void> {
    constructor(
        @Inject("DepositRepositoryInterface") private repository: DepositRepositoryInterface,
        @Inject("InternalBlockchain") private internalBlockchain: InternalBlockchain,
        private externalBlockchain: ExternalBlockchain,
        private normalizer: AssetNormalizer,
        @Inject("ConverterInterface") private converter: ConverterInterface
    ) {}

    async execute(command: DepositInternalContractRefund): Promise<void> {
        const deposit = await this.repository.getById(command.depositId);

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId);
        }

        const internalContractId = deposit.internalContract?.internalId as string;

        if (!(await this.hasRefundOperation(internalContractId, deposit._depositRequest.revpopAccount.value))) {
            console.log(`Deposit ${deposit.idString} has not refund yet.`);

            return;
        }

        console.log(`Deposit ${deposit.idString} has refund.`);
        deposit.burned(deposit.mintedAmount);

        try {
            await this.internalBlockchain.burnAsset(deposit.mintedAmount);
            this.repository.save(deposit);
            console.log(`Deposit ${deposit.idString} has burned.`);
        } catch (e: unknown) {
            console.log(`Error processing deposit ${deposit.idString}`);
        }
    }

    private async hasRefundOperation(internalContractId: string, accountName: string): Promise<boolean> {
        const refundOperations = await this.internalBlockchain.getRefundOperations(accountName);

        for (const refundOperation of refundOperations) {
            if (refundOperation.htlcContractId === internalContractId) {
                return true;
            }
        }

        return false;
    }
}
