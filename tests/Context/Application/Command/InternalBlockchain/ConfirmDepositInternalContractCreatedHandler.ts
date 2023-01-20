import {expect} from 'chai';
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ConfirmDepositInternalContractCreatedHandler
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreatedHandler/ConfirmDepositInternalContractCreatedHandler";
import ConfirmDepositInternalContractCreated
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreatedHandler/ConfirmDepositInternalContractCreated";
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import {createExternalContract} from "../../../../Helpers/ExternalContract";
import {createContract} from "../../../../Helpers/InternalBlockchain/Contract";
import {createDeposit} from "../../../../Helpers/Deposit";
import InternalContract from "context/Domain/InternalContract";
import {HashLockValidationError} from "context/Domain/Errors";

describe('ConfirmDepositInternalContractCreatedHandler', () => {
    let depositRepository: DepositStubRepository
    let internalBlockchain: InternalBlockchain
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let handler: ConfirmDepositInternalContractCreatedHandler

    const externalContractId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    beforeEach(async () => {
        internalBlockchain = await InternalBlockchain.init({
            repository: 'stub'
        })
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        depositRepository = new DepositStubRepository()
        handler = new ConfirmDepositInternalContractCreatedHandler(depositRepository, internalBlockchain)
    });

    describe('execute', () => {
        describe('success', () => {
            beforeEach(() => {

            })

            it('should change status to STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    externalId: externalContractId
                }))
                const deposit = createDeposit({
                    externalContract: createExternalContract(externalContractId)
                })
                deposit.submittedToInternalBlockchain()
                depositRepository._depositByExternalId = deposit

                const command = new ConfirmDepositInternalContractCreated()
                await handler.execute(command)

                const updatedDeposit = await depositRepository.getById(deposit.id.toValue())
                expect(updatedDeposit?.status).equals(10)
                expect(updatedDeposit?.internalContract).not.null

                const internalContract = deposit.internalContract as InternalContract
                expect(internalContract.externalId).equals(externalContractId)
            })
        })

        describe('error', () => {
            it('should throw error if deposit status is invalid', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    externalId: externalContractId
                }))
                const deposit = createDeposit({
                    externalContract: createExternalContract(externalContractId)
                })

                const command = new ConfirmDepositInternalContractCreated()
                await expect(handler.execute(command))
                    .rejectedWith(HashLockValidationError, 'HashLock "invalid_hashLock" is invalid: HashLock format is invalid')

            })

            it('should doing something if deposit with external id does not exist', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    externalId: externalContractId
                }))

                const command = new ConfirmDepositInternalContractCreated()
                // await expect(handler.execute(command)).rejectedWith()
            })
        })
    });
});
