import {expect} from 'chai';
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import InternalContract from 'context/Domain/InternalContract';
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import {STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import ConfirmDepositInternalContractCreatedHandler from 'context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreatedHandler';
import ConfirmDepositInternalContractCreated from 'context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractCreated/ConfirmDepositInternalContractCreated';
import {createDeposit} from "tests/Helpers/Deposit";
import {createDepositRequest} from "tests/Helpers/DepositRequest";
import { createExternalContract } from 'tests/Helpers/ExternalContract';

describe('ConfirmDepositInternalContractCreatedHandler', () => {
    let depositRequestRepository: DepositRequestTypeOrmRepository
    let depositRepository: DepositTypeOrmRepository
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let handler: ConfirmDepositInternalContractCreatedHandler
    const txHash = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
    const internalContractId = '1.16.1'

    beforeEach(async () => {
        depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)
        depositRepository = new DepositTypeOrmRepository(DataSource)
        const internalBlockchain = await InternalBlockchain.init({
            repository: 'stub'
        })
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        handler = new ConfirmDepositInternalContractCreatedHandler(depositRepository)
    });

    describe('execute', () => {
        describe('success', () => {
            it('should change deposit status', async () => {
                const depositRequest = createDepositRequest()
                await depositRequestRepository.create(depositRequest)
                const deposit = createDeposit({
                    depositRequest,
                    externalContract: createExternalContract({txHash})
                })
                deposit.submittedToInternalBlockchain()
                await depositRepository.create(deposit)

                const command = new ConfirmDepositInternalContractCreated(txHash, internalContractId)
                await handler.execute(command)

                const updatedDeposit = await depositRepository.getById(deposit.idString)
                expect(updatedDeposit?.status).equals(STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN)
                expect(updatedDeposit?.internalContract).not.null

                const internalContract = updatedDeposit?.internalContract as InternalContract
                expect(internalContract.internalId).equals(internalContractId)
            })
        })
    })
})
