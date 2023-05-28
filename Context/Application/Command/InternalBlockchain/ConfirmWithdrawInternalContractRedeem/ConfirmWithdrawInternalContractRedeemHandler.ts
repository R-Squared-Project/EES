import { UseCase } from "context/Core/Domain/UseCase";
import ConfirmWithdrawInternalContractRedeem from "./ConfirmWithdrawInternalContractRedeem";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import InternalContract from "context/Domain/InternalContract";
import { Inject, Injectable } from "@nestjs/common";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import Withdraw from "context/Domain/Withdraw";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";

@Injectable()
export default class ConfirmWithdrawInternalContractRedeemHandler
    implements UseCase<ConfirmWithdrawInternalContractRedeem, void>
{
    public constructor(
        private readonly getLastWithdrawContractsHandler:
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("WithdrawRequestRepositoryInterface")
        private readonly withdrawRequestRepository: WithdrawRequestRepositoryInterface,
        @Inject("InternalBlockchain") private readonly internalBlockchain: InternalBlockchain,
        private readonly assetNormalizer: AssetNormalizer
    ) {}

    public async execute(command: ConfirmWithdrawInternalContractRedeem): Promise<void> {
        const requests = await this.withdrawRequestRepository.findAllCreated();
        this.validateTransaction(command.transaction);
        const sender = await this.internalBlockchain.getAccount(command.transaction.htlcCreateSender ?? "");
        const senderName: string = sender.get("name");
        const asset = await this.internalBlockchain.getAsset(command.transaction.htlcCreateAssetId ?? "");
        const normalizedAmount = this.assetNormalizer.normalize(command.transaction.denormalizedAmount ?? "", asset);

        if (requests.length === 0) {
            throw new Error(
                `Withdraw request for transaction ${command.transaction.transactionId}(${senderName}, ${normalizedAmount}) not found.`
            );
        }

        for (const request of requests) {
            if (request.revpopAccount.value === senderName && request.amountToPayInRVETH == normalizedAmount) {
                const internalContract = new InternalContract(command.transaction.htlcId ?? "");
                const withdraw = Withdraw.create(
                    request,
                    internalContract,
                    command.transaction.htlcCreateId ?? "",
                    command.transaction.transferId ?? ""
                );
                request.withdrawCreated();
                this.withdrawRepository.save(withdraw);

                return;
            }
        }

        throw new Error(
            `Withdraw request for transaction ${command.transaction.transactionId}(${senderName}, ${normalizedAmount}) not found.`
        );
    }

    private validateTransaction(transaction: WithdrawTransaction) {
        if (!transaction.htlcCreateSender) {
            throw new Error(`Undefined HTLC sender in transaction ${transaction.transactionId}.`);
        }

        if (!transaction.denormalizedAmount) {
            throw new Error(`Undefined HTLC amount in transaction ${transaction.transactionId}.`);
        }

        if (!transaction.htlcCreateAssetId) {
            throw new Error(`Undefined HTLC asset Id in transaction ${transaction.transactionId}.`);
        }

        if (!transaction.htlcCreateId) {
            throw new Error(`Undefined HTLC operation ID in transaction ${transaction.transactionId}.`);
        }

        if (!transaction.htlcId) {
            throw new Error(`Undefined HTLC ID in transaction ${transaction.transactionId}.`);
        }

        if (!transaction.transferId) {
            throw new Error(`Undefined Transfer operation ID in transaction ${transaction.transactionId}.`);
        }
    }
}
