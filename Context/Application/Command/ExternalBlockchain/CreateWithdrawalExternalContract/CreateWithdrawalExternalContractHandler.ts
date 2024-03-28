import { UseCase } from "context/Core/Domain/UseCase";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import * as Errors from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";
import CreateWithdrawalExternalContract from "./CreateWithdrawalExternalContract";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import CreateWithdrawExternalContractValidator from "context/Domain/Validation/Withdraw/CreateWithdrawExternalContractValidator";
import Withdraw from "context/Domain/Withdraw";
import WrappedEtherToEtherConverter from "context/Infrastructure/WrappedEtherToEtherConverter";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import { Inject, Injectable } from "@nestjs/common";
import { DomainError } from "context/Core/Domain/DomainError";
import { PersistentError } from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";
import { ensureHasPrefix } from "context/Infrastructure/Helpers";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import config from "context/config";

@Injectable()
export default class CreateWithdrawalExternalContractHandler
    implements UseCase<CreateWithdrawalExternalContract, void>
{
    constructor(
        @Inject("WithdrawRepositoryInterface") private withdrawRepository: WithdrawRepositoryInterface,
        private externalBlockchain: ExternalBlockchain,
        @Inject("InternalBlockchain") private internalBlockChain: InternalBlockchain,
        private wrappedEtherToEtherConverter: WrappedEtherToEtherConverter,
        private normalizer: AssetNormalizer
    ) {}

    async execute(command: CreateWithdrawalExternalContract): Promise<void> {
        const withdraw = await this.withdrawRepository.getById(command.withdrawId);

        if (null === withdraw) {
            throw new Errors.WithdrawNotExists(command.withdrawId);
        }

        try {
            new CreateWithdrawExternalContractValidator(withdraw).validate();
        } catch (e: unknown) {
            if (e instanceof DomainError) {
                withdraw.error(e.message);
                this.withdrawRepository.save(withdraw);
                throw new PersistentError(e.message);
            }
        }

        const denormalizedAmount = await this.getDenormalizedContractAmount(withdraw);
        await this.externalBlockchain.createWithdrawHTLC(
            withdraw.withdrawRequest.addressOfUserInEthereum,
            ensureHasPrefix(withdraw.hashlock as string),
            Math.floor(Date.now() / 1000) + config.contract.withdraw_external_timelock * 60,
            denormalizedAmount
        );

        withdraw.sentInReply();
        await this.withdrawRepository.save(withdraw);
    }

    async getDenormalizedContractAmount(withdraw: Withdraw): Promise<string> {
        const normalizedAmount = this.normalizer.normalize(
            String(withdraw.amountOfHTLC),
            await this.internalBlockChain.getInternalAsset()
        );

        return this.normalizer.denormalize(
            this.wrappedEtherToEtherConverter.convert(normalizedAmount),
            this.externalBlockchain.getAsset()
        );
    }

    async getDenormalizedGasPrice(): Promise<string> {
        return this.externalBlockchain.getGasPrice();
    }
}
