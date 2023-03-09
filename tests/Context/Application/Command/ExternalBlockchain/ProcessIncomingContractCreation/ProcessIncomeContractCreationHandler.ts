import {expect} from 'chai';
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import DepositRequestStubRepository from "context/Infrastructure/Stub/DepositRequestRepository";
import ExternalBlockchainStubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import * as ErrorsDomain from "context/Domain/Errors";
import {createContract} from "tests/Helpers/ExternalBlockchain/Contract";
import dayjs from "dayjs";
import {createDepositRequest} from "tests/Helpers/DepositRequest";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import HashLock from "context/Domain/ValueObject/HashLock";
import Deposit from "context/Domain/Deposit";
import Address from "context/Domain/ValueObject/Address";
import GetLastContractsHandler
    from "context/Application/Query/ExternalBlockchain/GetLastContracts/GetLastContractsHandler";
import Setting from "context/Setting/Setting";
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";

describe('ProcessIncomeContractCreationHandler', () => {
    let depositRepository: DepositStubRepository;
    let depositRequestRepository: DepositRequestStubRepository;
    let externalBlockchain: ExternalBlockchain;
    let externalBlockchainRepository: ExternalBlockchainStubRepository;
    let handler: ProcessIncomingContractCreationHandler;
    let setting: Setting
    let getLastContractsHandler: GetLastContractsHandler

    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'
    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
    const timeLock = dayjs().add(10, 'day').unix()
    const contractId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
    const value = '10000000000000000'
    const sender = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198D'
    const receiver = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E'

    beforeEach(function() {
        depositRepository = new DepositStubRepository()
        depositRequestRepository = new DepositRequestStubRepository()
        externalBlockchain = new ExternalBlockchain('stub')
        externalBlockchainRepository = externalBlockchain.repository as ExternalBlockchainStubRepository
        setting = Setting.init({
            repository: 'typeorm',
            dataSource: DataSource
        })
        getLastContractsHandler = new GetLastContractsHandler(externalBlockchain)

        handler = new ProcessIncomingContractCreationHandler(
            depositRepository,
            depositRequestRepository,
            externalBlockchain,
            getLastContractsHandler
        );
    });

    describe('execute', () => {
        describe('success', () => {
            beforeEach(() => {
                depositRepository.reset()
                depositRequestRepository.reset()
                externalBlockchainRepository.reset()

                externalBlockchainRepository._contract = createContract({
                    contractId,
                    hashLock: hashLock,
                    timeLock: timeLock,
                    value: value
                })
                depositRequestRepository.create(createDepositRequest(
                    undefined,
                    hashLock
                ))
            })

            it('should save new deposit', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                // await expect(handler.execute(command)).fulfilled
                expect(depositRepository).repositorySize(1)
            });

            it('should use correct deposit request', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                // await expect(handler.execute(command)).fulfilled

                const deposit = depositRepository.first() as Deposit
                expect(deposit).not.null

                expect(deposit._depositRequest?.hashLock.equals(HashLock.create(hashLock))).true
            });

            it('should use correct external contract', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                // await expect(handler.execute(command)).fulfilled

                const deposit = depositRepository.first() as Deposit
                expect(deposit).not.null

                const externalContract = deposit._externalContract

                expect(externalContract.hashLock.equals(HashLock.create(hashLock))).true
                expect(externalContract.timeLock.unix).equals(timeLock)
                expect(externalContract.value).equals(value)
                expect(externalContract.sender.equals(Address.create(sender)), 'Sender is invalid.').true
                expect(externalContract.receiver.equals(Address.create(receiver)), 'Receiver is invalid.').true
            });
        })

        describe('error', () => {
            it('should throw an error if the transaction is not included in the blockchain', async () => {
                externalBlockchainRepository._txIncluded = false

                const command = new ProcessIncomingContractCreation(txHash, contractId)

                // await expect(handler.execute(command)).rejectedWith(Errors.TransactionNotFoundInBlockchain)
            });

            it('should throw an error if the deposit already exists', async () => {
                depositRepository._exists = true

                const command = new ProcessIncomingContractCreation(txHash, contractId)

                // await expect(handler.execute(command)).rejectedWith(Errors.DepositAlreadyExists)
            });

            it('should throw an error if the deposit request is not exists', async () => {
                externalBlockchainRepository._contract = createContract({
                    contractId,
                    hashLock: '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
                })
                depositRequestRepository.create(createDepositRequest(
                    undefined,
                    '0x22383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55d'
                ))

                const command = new ProcessIncomingContractCreation(txHash, contractId)

                // await expect(handler.execute(command)).rejectedWith(Errors.DepositRequestNotExists)
                //TODO: Test that transaction is saved to db
            });

            it('should throw an error if the external contract is not exists', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)

                // await expect(handler.execute(command)).rejectedWith(Errors.ExternalContractNotExists)
            });

            describe('external contract validation', () => {
                it('should throw an error if the receiver is invalid', async () => {
                    externalBlockchainRepository._contract = createContract({
                        receiver: '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198A'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    // await expect(handler.execute(command)).rejectedWith(ErrorsDomain.ReceiverIsInvalid)
                });

                it('should throw an error if deposit value is too low', async () => {
                    externalBlockchainRepository._contract = createContract({
                        value: '1'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    // await expect(handler.execute(command)).rejectedWith(ErrorsDomain.DepositIsToSmall)
                });

                it('should throw an error if timeLock is too early', async () => {
                    externalBlockchainRepository._contract = createContract({
                        timeLock: dayjs().add(1, 'day').unix()
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    // await expect(handler.execute(command)).rejectedWith(ErrorsDomain.TimeLockIsToSmall)
                });

                it('should throw an error if timeLock is too early', async () => {
                    externalBlockchainRepository._contract = createContract({
                        preimage: '0x0000000000000000000000000000000000000000000000000000000000000001'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    // await expect(handler.execute(command)).rejectedWith(ErrorsDomain.PreimageNotEmpty)
                });
            })
        })
    });
});
