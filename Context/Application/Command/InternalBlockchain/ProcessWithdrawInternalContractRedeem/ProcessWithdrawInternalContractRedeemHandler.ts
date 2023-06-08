import { UseCase } from "context/Core/Domain/UseCase";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors";
import { Inject, Injectable } from "@nestjs/common";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import ConverterInterface from "context/Domain/ConverterInterface";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import ProcessWithdrawInternalContractRedeem from "context/Application/Command/InternalBlockchain/ProcessWithdrawInternalContractRedeem/ProcessWithdrawInternalContractRedeem";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";

@Injectable()
export default class ProcessWithdrawInternalContractRedeemHandler
    implements UseCase<ProcessWithdrawInternalContractRedeem, void>
{
    constructor(
        @Inject("WithdrawRepositoryInterface") private repository: WithdrawRepositoryInterface,
        @Inject("InternalBlockchain") private internalBlockchain: InternalBlockchain,
        private externalBlockchain: ExternalBlockchain,
        private normalizer: AssetNormalizer,
        @Inject("ConverterInterface") private converter: ConverterInterface
    ) {}

    async execute(command: ProcessWithdrawInternalContractRedeem): Promise<void> {
        const withdraw = await this.repository.getById(command.withdrawId);

        if (withdraw === null) {
            throw new Errors.WithdrawNotFound(command.withdrawId);
        }

        const internalContractId = withdraw.internalContract?.internalId as string;
        const asset = await this.internalBlockchain.getAsset(withdraw.withdrawRequest.withdrawalFeeCurrency);
        const denormalizedAmount = this.normalizer.denormalize(withdraw.withdrawRequest.withdrawalFeeAmount, asset);

        if (!withdraw.secret) {
            throw new Errors.WithdrawWithoutSecret(withdraw.idString);
        }

        withdraw.redeemed();

        try {
            await this.internalBlockchain.withdrawRedeem(withdraw.secret, internalContractId, denormalizedAmount);
            await this.repository.save(withdraw);
            console.log(`ProcessWithdrawInternalContractRedeemHandler: Withdraw ${withdraw.idString} has redeemed.`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                withdraw.error(e.message);
                await this.repository.save(withdraw);
            }

            console.log(
                `ProcessWithdrawInternalContractRedeemHandler: Error processing withdraw redeem ${withdraw.idString}`
            );
        }
    }
}
