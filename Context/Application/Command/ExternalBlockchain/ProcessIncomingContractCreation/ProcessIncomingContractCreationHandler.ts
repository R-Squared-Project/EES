import {UseCase} from "context/Core/Domain/UseCase";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import HashLock from "context/Domain/ValueObject/HashLock";
import ExternalContractValidator from "context/Application/Command/ExternalBlockchain/ExternalContractValidator";
import ExternalContract from "context/Domain/ExternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Deposit from "context/Domain/Deposit";
import {DatabaseConnectionError} from "context/Infrastructure/Errors";
import Address from "context/Domain/ValueObject/Address";
import TimeLock from "context/Domain/ValueObject/TimeLock";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export default class ProcessIncomingContractCreationHandler implements UseCase<ProcessIncomingContractCreation, void> {
    constructor(
        @Inject("DepositRepositoryInterface") private repository: DepositRepositoryInterface,
        @Inject("DepositRequestRepositoryInterface") private depositRequestRepository: DepositRequestRepositoryInterface,
        private externalBlockchain: ExternalBlockchain
    ) {}

    async execute(command: ProcessIncomingContractCreation): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash)
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash)
        }

        const depositExists = await this.repository.exists(command.contractId)
        if (depositExists) {
            throw new Errors.DepositAlreadyExists(command.contractId)
        }

        const contract = await this.externalBlockchain.repository.load(command.txHash, command.contractId)
        if (null === contract) {
            throw new Errors.ExternalContractNotExists(command.contractId)
        }

        new ExternalContractValidator(contract).validate()

        const externalContract = new ExternalContract(
            new UniqueEntityID(contract.contractId),
            Address.create(contract.sender),
            Address.create(contract.receiver),
            contract.value,
            HashLock.create(contract.hashLock),
            TimeLock.fromUnix(contract.timeLock),
            command.txHash
        )

        const depositRequest = await this.depositRequestRepository.load(HashLock.create(contract.hashLock))
        if (null === depositRequest) {
            //TODO::Save contract to a separate table
            throw new Errors.DepositRequestNotExists(contract.hashLock)
        }

        const deposit = Deposit.create(depositRequest, externalContract)

        try {
            await this.repository.create(deposit)
        } catch (e: unknown) {
            throw new DatabaseConnectionError()
        }
    }
}
