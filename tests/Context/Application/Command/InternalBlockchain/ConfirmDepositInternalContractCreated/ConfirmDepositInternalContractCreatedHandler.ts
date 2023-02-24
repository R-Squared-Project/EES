import {expect} from 'chai';
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import {createExternalContract} from "tests/Helpers/ExternalContract";
import {createDeposit} from "tests/Helpers/Deposit";
import InternalContract from "context/Domain/InternalContract";
import ConfirmDepositInternalContractCreatedHandler
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreatedHandler";
import ConfirmDepositInternalContractCreated
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreated";
import * as Errors from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/Errors";
import * as DomainErrors from "context/Domain/Errors";

describe('ConfirmDepositInternalContractCreatedHandler', () => {
    let depositRepository: DepositStubRepository
    let handler: ConfirmDepositInternalContractCreatedHandler

    beforeEach(async () => {
        depositRepository = new DepositStubRepository()
        handler = new ConfirmDepositInternalContractCreatedHandler(depositRepository)
    });

    describe('execute', () => {
        const txHash = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

        describe('success', () => {
            it('should change status to STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN', async () => {
                const deposit = createDeposit({
                    externalContract: createExternalContract({txHash})
                })
                deposit.submittedToInternalBlockchain()
                depositRepository.create(deposit)
                const internalId = '1.16.1'

                const command = new ConfirmDepositInternalContractCreated(txHash, internalId)
                await handler.execute(command)

                const updatedDeposit = await depositRepository.getById(deposit.id.toValue())
                expect(updatedDeposit?.status).equals(10)
                expect(updatedDeposit?.internalContract).not.null

                const internalContract = deposit.internalContract as InternalContract
                expect(internalContract.internalId).equals(internalId)
            })
        })

        describe('error', () => {
            it('should throw error if deposit with external id does not exist', async () => {
                const command = new ConfirmDepositInternalContractCreated('invalid_external_id', '1.16.1')
                await expect(handler.execute(command)).rejectedWith(Errors.DepositNotFound)
            })

            it('should throw error if deposit status is invalid', async () => {
                const deposit = createDeposit({
                    externalContract: createExternalContract({txHash})
                })
                depositRepository.create(deposit)

                const command = new ConfirmDepositInternalContractCreated(txHash, '1.16.1')
                await expect(handler.execute(command)).rejectedWith(DomainErrors.ConfirmDepositInternalContractCreatedStatusError)

            })
        })
    });
});
