import {UseCase} from "context/Core/Domain/UseCase";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import Deposit from "context/Domain/Deposit";
import ExternalContract from "context/Domain/ExternalContract";
import RepositoryInterface from "context/Domain/RepositoryInterface";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import {DatabaseConnectionError} from "context/Infrastructure/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import HashLock from "context/Domain/ValueObject/HashLock";

export default class ProcessIncomingContractCreationHandler implements UseCase<ProcessIncomingContractCreation, void> {
    constructor(
        private repository: RepositoryInterface,
        private depositRequestRepository: DepositRequestRepositoryInterface
    ) {}

    async execute(command: ProcessIncomingContractCreation): Promise<void> {
        const txIncluded = await ExternalBlockchain.repository.txIncluded(command.txHash)
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash)
        }

        const depositExists = await this.repository.exists(command.contractId)
        if (depositExists) {
            throw new Errors.DepositAlreadyExists(command.contractId)
        }

        const contract = await ExternalBlockchain.repository.load(command.txHash, command.contractId)
        if (null === contract) {
            throw new Errors.ExternalContractNotExists(command.contractId)
        }
        const externalContract = ExternalContract.fromContract(contract)

        const depositRequest = await this.depositRequestRepository.load(HashLock.create(contract.hashLock))
        if (null === depositRequest) {
            //TODO::Save contract to a separate table
            throw new Errors.DepositRequestNotExists(contract.hashLock)
        }

        const deposit = Deposit.create(depositRequest,  externalContract)
        console.log(deposit)

        try {
            await this.repository.create(deposit)
        } catch (e: unknown) {
            throw new DatabaseConnectionError()
        }
    }
}
