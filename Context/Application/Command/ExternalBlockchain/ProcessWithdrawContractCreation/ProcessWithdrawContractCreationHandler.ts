import { UseCase } from "context/Core/Domain/UseCase";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/Errors";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import HashLock from "context/Domain/ValueObject/HashLock";
import ExternalContract from "context/Domain/ExternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import { DatabaseConnectionError } from "context/Infrastructure/Errors";
import Address from "context/Domain/ValueObject/Address";
import TimeLock from "context/Domain/ValueObject/TimeLock";
import { Inject, Injectable } from "@nestjs/common";
import ProcessWithdrawContractCreation from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreation";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import WithdrawExternalContractValidator from "context/Application/Command/ExternalBlockchain/WithdrawExternalContractValidator";

@Injectable()
export default class ProcessWithdrawContractCreationHandler implements UseCase<ProcessWithdrawContractCreation, void> {
    constructor(
        @Inject("WithdrawRepositoryInterface") private repository: WithdrawRepositoryInterface,
        private externalBlockchain: ExternalBlockchain
    ) {}

    async execute(command: ProcessWithdrawContractCreation): Promise<void> {
        const txIncluded = await this.externalBlockchain.repository.txIncluded(command.txHash);
        if (!txIncluded) {
            throw new Errors.TransactionNotFoundInBlockchain(command.txHash);
        }

        const withdraw = await this.repository.getByHashLock(command.hashLock);
        if (!withdraw) {
            throw new Errors.WithdrawNotExists(command.hashLock);
        }

        const contract = await this.externalBlockchain.repository.loadWithdrawContract(
            command.txHash,
            command.contractId
        );

        if (null === contract) {
            throw new Errors.ExternalContractNotExists(command.contractId);
        }

        new WithdrawExternalContractValidator(contract).validate();

        const externalContract = new ExternalContract(
            new UniqueEntityID(contract.contractId),
            Address.create(contract.sender),
            Address.create(contract.receiver),
            contract.value,
            HashLock.create(contract.hashLock),
            TimeLock.fromUnix(contract.timeLock),
            command.txHash
        );

        withdraw.readyToSign(externalContract);

        try {
            await this.repository.save(withdraw);
        } catch (e: unknown) {
            throw new DatabaseConnectionError();
        }
    }
}
