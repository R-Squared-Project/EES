import dayjs from "dayjs";
import config from "context/config";
import { UseCase } from "context/Core/Domain/UseCase";
import CreateContractInInternalBlockchain from "./CreateContractInInternalBlockchain";
import RepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ConverterInterface from "context/Domain/ConverterInterface";
import * as Errors from "./Errors";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

export default class CreateContractInInternalBlockchainHandler
    implements UseCase<CreateContractInInternalBlockchain, void>
{
    constructor(
        private readonly repository: RepositoryInterface,
        private readonly internalBlockchain: InternalBlockchain,
        private readonly externalBlockchain: ExternalBlockchain,
        private readonly converter: ConverterInterface,
        private readonly normalizer: AssetNormalizer
    ) {}

    async execute(command: CreateContractInInternalBlockchain): Promise<void> {
        const deposit = await this.repository.getById(command.depositId);

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId);
        }

        const RQETHAmount = this.converter.convert(
            this.normalizer.normalize(deposit._externalContract.value, this.externalBlockchain.getAsset())
        ) - config.r_squared.rqeth_deposit_fee;

        const denormalizedAmount = this.normalizer.denormalize(
            RQETHAmount,
            await this.internalBlockchain.getInternalAsset()
        );

        deposit.submittedToInternalBlockchain(denormalizedAmount);
        await this.repository.save(deposit);

        try {
            await this.internalBlockchain.createContract(
                deposit._externalContract.txHash,
                deposit._depositRequest.nativeAccount.value,
                denormalizedAmount,
                deposit._depositRequest.hashLock.value.substring(2),
                this.timeLock()
            );
        } catch (e: unknown) {
            deposit.resetToCreated();
            await this.repository.save(deposit);
            throw e;
        }
    }

    private timeLock(): number {
        return dayjs().add(config.r_squared.redeem_timeframe, "minutes").diff(dayjs(), "seconds");
    }
}
