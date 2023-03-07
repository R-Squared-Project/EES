import {UseCase} from "context/Core/Domain/UseCase";
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
import ExternalBlockchainHandlerInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ExternalBlockchainHandlerInterface";
import BlockRange from "context/Application/Command/ExternalBlockchain/ChainProcessor/BlockRange";
import AfterIncomingContractProcessed from "context/Subscribers/AfterIncomingContractProcessed";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export default class ProcessIncomingContractCreationHandler implements UseCase<BlockRange, void>, ExternalBlockchainHandlerInterface {
    constructor(
        @Inject("DepositRepositoryInterface") private repository: DepositRepositoryInterface,
        @Inject("DepositRequestRepositoryInterface") private depositRequestRepository: DepositRequestRepositoryInterface,
        private externalBlockchain: ExternalBlockchain,
        private getLastContractsHandler: GetLastContractsHandler
    ) {}

    async execute(range: BlockRange): Promise<void> {
        const lastContracts = await this.getLastContractsHandler.execute(range)
        for (const event of lastContracts.events) {
            console.log(`Process transaction ${event.transactionHash}`)

            await this.processContract(event.transactionHash, event.returnValues.contractId)
        }
    }

    private async processContract(txHash: string, contractId: string) {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(txHash)
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(txHash)
        }

        const depositExists = await this.repository.exists(contractId)
        if (depositExists) {
            throw new Errors.DepositAlreadyExists(contractId)
        }

        const contract = await this.externalBlockchain.repository.load(txHash, contractId)
        if (null === contract) {
            throw new Errors.ExternalContractNotExists(contractId)
        }

        new ExternalContractValidator(contract).validate()

        new AfterIncomingContractProcessed()

        const externalContract = new ExternalContract(
            new UniqueEntityID(contract.contractId),
            Address.create(contract.sender),
            Address.create(contract.receiver),
            contract.value,
            HashLock.create(contract.hashLock),
            TimeLock.fromUnix(contract.timeLock),
            txHash
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
