import { UseCase } from "context/Core/Domain/UseCase";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import * as Errors from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/Errors";
import CreateWithdrawalExternalContract from "./CreateWithdrawalExternalContract";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import CreateWithdrawExternalContractValidator from "context/Domain/Validation/Withdraw/CreateWithdrawExternalContractValidator";
import Withdraw from "context/Domain/Withdraw";
import WrappedEtherToEtherConverter from "context/Infrastructure/WrappedEtherToEtherConverter";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";

export default class CreateWithdrawalExternalContractHandler
    implements UseCase<CreateWithdrawalExternalContract, void>
{
    constructor(
        private withdrawRepository: WithdrawRepositoryInterface,
        private externalBlockchain: ExternalBlockchain,
        private wrappedEtherToEtherConverter: WrappedEtherToEtherConverter,
        private normalizer: AssetNormalizer
    ) {}

    async execute(command: CreateWithdrawalExternalContract): Promise<void> {
        const withdraw = await this.withdrawRepository.getById(command.withdrawId);

        if (null === withdraw) {
            throw new Errors.WithdrawNotExists(command.withdrawId);
        }

        new CreateWithdrawExternalContractValidator(withdraw).validate();
        const denormalizedAmount = this.getDenormalizedContractAmount(withdraw);
        const denormalizedGasPrice = await this.getDenormalizedGasPrice();

        await this.withdrawRepository.save(withdraw);
    }

    getDenormalizedContractAmount(withdraw: Withdraw): string {
        return this.normalizer.denormalize(
            this.wrappedEtherToEtherConverter.convert(withdraw.amountOfHTLC ?? 0),
            this.externalBlockchain.getAsset()
        );
    }

    async getDenormalizedGasPrice(): Promise<string> {
        return this.externalBlockchain.getGasPrice();
    }
}
