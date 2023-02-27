import {expect} from 'chai';
import DataSource from "context/Infrastructure/TypeORM/DataSource/DataSource";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import DepositTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import {STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInInternalBlockchain/CreateContractInInternalBlockchainHandler";
import {createDeposit} from "tests/Helpers/Deposit";
import {createDepositRequest} from "tests/Helpers/DepositRequest";

describe('CreateContractInInternalBlockchainHandler', () => {
    let depositRequestRepository: DepositRequestTypeOrmRepository
    let depositRepository: DepositTypeOrmRepository
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let handler: CreateContractInInternalBlockchainHandler

    beforeEach(async () => {
        depositRequestRepository = new DepositRequestTypeOrmRepository(DataSource)
        depositRepository = new DepositTypeOrmRepository(DataSource)
        const internalBlockchain = await InternalBlockchain.init({
            repository: 'stub'
        })
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        const converter = new EtherToWrappedEtherConverter()
        handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter)
    });

    describe('execute', () => {
        describe('success', () => {
            it('should change deposit status', async () => {
                const depositRequest = createDepositRequest()
                await depositRequestRepository.create(depositRequest)
                const deposit = createDeposit({depositRequest})
                await depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)
                await handler.execute(command)

                const updatedDeposit = await depositRepository.getById(deposit.idString)
                expect(updatedDeposit?.status).equals(STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN)
            })
        })
    })
})
