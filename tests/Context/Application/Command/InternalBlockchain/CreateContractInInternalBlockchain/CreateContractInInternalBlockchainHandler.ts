import {expect} from 'chai';
import dayjs from "dayjs";
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import EtherToWrappedEtherConverter from "context/Infrastructure/EtherToWrappedEtherConverter";
import {STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import CreateContractInInternalBlockchain
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchain";
import CreateContractInInternalBlockchainHandler
    from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/CreateContractInInternalBlockchainHandler";
import * as Errors from "context/Application/Command/InternalBlockchain/CreateContractInRevpop/Errors";
import * as DomainErrors from "context/Domain/Errors";
import {createDeposit} from "../../../../../Helpers/Deposit";
import {createExternalContract} from "../../../../../Helpers/ExternalContract";

describe('CreateContractInInternalBlockchainHandler', () => {
    let depositRepository: DepositStubRepository;
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let handler: CreateContractInInternalBlockchainHandler;

    beforeEach(async () => {
        depositRepository = new DepositStubRepository()
        const internalBlockchain = await InternalBlockchain.init({
            repository: 'stub'
        })
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        const converter = new EtherToWrappedEtherConverter()
        handler = new CreateContractInInternalBlockchainHandler(depositRepository, internalBlockchain, converter);
    });

    describe('execute', () => {
        describe('success', () => {
            it('should be completed without errors', async () => {
                const deposit = createDeposit()
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)

                await expect(handler.execute(command)).fulfilled
            });
            it('should change deposit status', async () => {
                const deposit = createDeposit()
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)
                await handler.execute(command)

                const updatedDeposit = await depositRepository.getById(deposit.idString)
                expect(updatedDeposit?.status).equals(STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN)
            });

            it('should create one contract in internal blockchain', async () => {
                const deposit = createDeposit()
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)
                await handler.execute(command)

                const internalContracts = internalBlockchainRepository.contracts
                expect(internalContracts).length(1)
            });

            it('should create contract with correct parameters', async () => {
                const deposit = createDeposit()
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)
                await handler.execute(command)

                const internalContract = internalBlockchainRepository.contracts[0]

                expect(internalContract.externalId).equals(deposit._externalContract.idString)
                expect(internalContract.accountToName).equals(deposit._depositRequest.revpopAccount.value)
                //TODO::check value
                //expect(internalContract.amount).equals(Web3.utils.fromWei(deposit._externalContract.value))
                expect(internalContract.hashLock).equals(deposit._externalContract.hashLock.value.slice(2))
            });

            it('should create contract with correct timelock', async () => {
                const externalContract = createExternalContract({
                    timeLock: dayjs().add(10, 'days').unix()
                })
                const deposit = createDeposit(undefined, externalContract)
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)
                await handler.execute(command)

                const internalContract = internalBlockchainRepository.contracts[0]
                expect(internalContract.timeLock).equals(600) //from env.test
            });
        })

        describe('error', () => {
            it('should throw error if deposit is not exist', async () => {
                const command = new CreateContractInInternalBlockchain('invalid_deposit_id')

                await expect(handler.execute(command)).rejectedWith(Errors.DepositNotFound)
            });

            it('should throw error if deposit has invalid state', async () => {
                const deposit = createDeposit()
                deposit.submittedToInternalBlockchain()
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)

                await expect(handler.execute(command)).rejectedWith(DomainErrors.CreateContractInInternalBlockchainStatusError)
            });

            it('should throw error if external deposit timelock is too small', async () => {
                const externalContract = createExternalContract({
                    timeLock: dayjs().unix()
                })
                const deposit = createDeposit(undefined, externalContract)
                depositRepository.create(deposit)

                const command = new CreateContractInInternalBlockchain(deposit.idString)

                await expect(handler.execute(command)).rejectedWith(DomainErrors.CreateContractInInternalBlockchainTimeLockError)
            });
        })
    });
});
