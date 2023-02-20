import dayjs from "dayjs";
import config from "context/config";
import {UseCase} from "context/Core/Domain/UseCase";
import CreateContractInInternalBlockchain from "./CreateContractInInternalBlockchain";
import RepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ConverterInterface from "context/Domain/ConverterInterface";
import * as Errors from "./Errors";

export default class CreateContractInInternalBlockchainHandler implements UseCase<CreateContractInInternalBlockchain, void> {
    constructor(
        private readonly repository: RepositoryInterface,
        private readonly internalBlockchain: InternalBlockchain,
        private readonly converter: ConverterInterface
    ) {}

    async execute(command: CreateContractInInternalBlockchain): Promise<void> {
        const deposit = await this.repository.getById(command.depositId)

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId)
        }

        const rvEthAmount = this.converter.convert(deposit._externalContract.value)

        deposit.submittedToInternalBlockchain()

        await this.internalBlockchain.createContract(
            deposit._externalContract.txHash,
            deposit._depositRequest.revpopAccount.value,
            rvEthAmount,
            deposit._depositRequest.hashLock.value.substring(2),
            this.timeLock()
        )

        await this.repository.save(deposit)
    }

    private timeLock(): number {
        return dayjs().add(config.revpop.redeem_timeframe, 'minutes').diff(dayjs(), 'seconds')
    }
}
