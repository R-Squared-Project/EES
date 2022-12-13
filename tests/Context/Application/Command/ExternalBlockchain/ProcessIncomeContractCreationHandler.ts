import {expect} from 'chai';
import StubRepository from "context/Infrastructure/TypeORM/StubRepository";
import DepositRequestStubRepository from "context/Infrastructure/TypeORM/DepositRequestStubRepository";
import ExternalBlockchainStubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import ProcessIncomingContractCreationHandler
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreationHandler";
import ProcessIncomingContractCreation
    from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/ProcessIncomingContractCreation";
import * as Errors from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";
import * as ErrorsDomain from "context/Domain/Errors";
import {createContract} from "../../../../Helpers/Contract";
import dayjs from "dayjs";
import {createDepositRequest} from "../../../../Helpers/DepositRequest";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import HashLock from "context/Domain/ValueObject/HashLock";

describe('ProcessIncomeContractCreationHandler', () => {
    let depositRepository: StubRepository;
    let depositRequestRepository: DepositRequestStubRepository;
    let externalBlockchain: ExternalBlockchain;
    let externalBlockchainRepository: ExternalBlockchainStubRepository;
    let handler: ProcessIncomingContractCreationHandler;

    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'
    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
    const contractId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    beforeEach(function() {
        depositRepository = new StubRepository()
        depositRequestRepository = new DepositRequestStubRepository()
        externalBlockchain = new ExternalBlockchain('stub')
        externalBlockchainRepository = externalBlockchain.repository as ExternalBlockchainStubRepository

        handler = new ProcessIncomingContractCreationHandler(
            depositRepository,
            depositRequestRepository,
            externalBlockchain
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
                    hashLock: hashLock
                })
                depositRequestRepository.create(createDepositRequest(
                    undefined,
                    hashLock
                ))
            })

            it('should save new deposit', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                await expect(handler.execute(command)).fulfilled
                expect(depositRepository).repositorySize(1)
            });

            it('should use correct deposit request', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                await expect(handler.execute(command)).fulfilled

                const deposit = depositRepository.first()

                const depositRequest = deposit?._depositRequest
                expect(depositRequest?.hashLock.equals(HashLock.create(hashLock))).true
            });

            it('should use correct external contract', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)
                await expect(handler.execute(command)).fulfilled

                const deposit = depositRepository.first()

                const externalContract = deposit?._externalContract
                expect(externalContract?.hashLock.equals(HashLock.create(hashLock))).true
            });
        })

        describe('error', () => {
            it('should throw an error if the transaction is not included in the blockchain', async () => {
                externalBlockchainRepository._txIncluded = false

                const command = new ProcessIncomingContractCreation(txHash, contractId)

                await expect(handler.execute(command)).rejectedWith(Errors.TransactionNotFoundInBlockchain)
            });

            it('should throw an error if the deposit already exists', async () => {
                depositRepository._exists = true

                const command = new ProcessIncomingContractCreation(txHash, contractId)

                await expect(handler.execute(command)).rejectedWith(Errors.DepositAlreadyExists)
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

                await expect(handler.execute(command)).rejectedWith(Errors.DepositRequestNotExists)
                //TODO: Test that transaction is saved to db
            });

            it('should throw an error if the external contract is not exists', async () => {
                const command = new ProcessIncomingContractCreation(txHash, contractId)

                await expect(handler.execute(command)).rejectedWith(Errors.ExternalContractNotExists)
            });

            describe('external contract validation', () => {
                it('should throw an error if the receiver is invalid', async () => {
                    externalBlockchainRepository._contract = createContract({
                        receiver: '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198A'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    await expect(handler.execute(command)).rejectedWith(ErrorsDomain.ReceiverIsInvalid)
                });

                it('should throw an error if deposit value is too low', async () => {
                    externalBlockchainRepository._contract = createContract({
                        value: '1'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    await expect(handler.execute(command)).rejectedWith(ErrorsDomain.DepositIsToSmall)
                });

                it('should throw an error if timeLock is too early', async () => {
                    externalBlockchainRepository._contract = createContract({
                        timeLock: dayjs().add(1, 'day').unix()
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    await expect(handler.execute(command)).rejectedWith(ErrorsDomain.TimeLockIsToSmall)
                });

                it('should throw an error if timeLock is too early', async () => {
                    externalBlockchainRepository._contract = createContract({
                        preimage: '0x0000000000000000000000000000000000000000000000000000000000000001'
                    })

                    const command = new ProcessIncomingContractCreation(txHash, contractId)

                    await expect(handler.execute(command)).rejectedWith(ErrorsDomain.PreimageNotEmpty)
                });
            })
        })
    });
});
