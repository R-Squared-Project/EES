import {expect} from 'chai';
import dayjs from "dayjs";
import StubRepository from '../../../../../../Context/Eth/Infrastructure/StubRepository';
import CreateDepositHandler from '../../../../../../Context/Eth/Application/Command/CreateDeposit/CreateDepositHandler';
import {CreateDeposit} from '../../../../../../Context/Eth';
import StubContractRepository from "../../../../../../Context/Eth/Infrastructure/StubContractRepository";
import Contract from "../../../../../../Context/Eth/Domain/Contract";
import Deposit from "../../../../../../Context/Eth/Domain/Deposit";
import DepositCreatedEvent from "../../../../../../Context/Eth/Domain/Event/DepositCreatedEvent";
import {
    DepositAlreadyExists,
    TransactionNotFoundInBlockchain
} from "../../../../../../Context/Eth/Application/Command/CreateDeposit/Errors";
import TxHash from "../../../../../../Context/Eth/Domain/TxHash";
import Address from "../../../../../../Context/Eth/Domain/Address";

describe('Eth::CreateDepositHandler', () => {
    let repository: StubRepository;
    let contractRepository: StubContractRepository
    let handler: CreateDepositHandler;
    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'

    beforeEach(function() {
        repository = new StubRepository()
        contractRepository = new StubContractRepository()
        handler = new CreateDepositHandler(repository, contractRepository);
    });

    describe('execute', () => {
        describe('without errors', () => {
            let contract: Contract

            beforeEach(() => {
                contractRepository.addTxHash(txHash)
                contract = new Contract(
                    'contract_id',
                    '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E',
                    '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E',
                    '10000000000000000',
                    'hash_lock',
                    dayjs().add(10, 'day').unix(),
                    false,
                    false,
                    '',
                    dayjs()
                )
                contractRepository.addContract(contract)
            })

            it('should save new deposit', async () => {
                const command = new CreateDeposit(txHash,'contract_id')

                const depositOrError = await handler.execute(command)

                expect(depositOrError.isLeft()).false
                expect(depositOrError.isRight()).true
                expect(repository.size).equals(1)
            });

            it('deposit should be correct', async () => {
                const command = new CreateDeposit(txHash,'contract_id')

                const deposit = (await handler.execute(command)).value.getValue() as Deposit

                expect(deposit.txHash.value).equals(command.txHash)
                expect(deposit.contractId).equals(command.contractId)
                expect(deposit.sender.value).equals(contract.sender)
                expect(deposit.receiver.value).equals(contract.receiver)
                expect(deposit.value).equals(contract.value)
                expect(deposit.hashLock).equals(contract.hashLock)
                expect(deposit.status).equals(1)
            });

            it('deposit should contain correct events', async () => {
                const command = new CreateDeposit(txHash,'contract_id')

                const deposit = (await handler.execute(command)).value.getValue() as Deposit

                expect(deposit.domainEvents).length(1)
                expect(deposit.domainEvents[0]).instanceof(DepositCreatedEvent)
            });
        })

        describe('with errors', () => {
            it('should not add transaction which is not included in blockchain', async () => {
                const command = new CreateDeposit(txHash,'contract_id')

                const depositOrError = (await handler.execute(command))
                expect(depositOrError.isLeft()).true
                expect(depositOrError.value).instanceof(TransactionNotFoundInBlockchain)
            })

            it('should not create duplicate deposit', async () => {
                const deposit = Deposit.create(
                    TxHash.create(txHash).getValue() as TxHash,
                    'contract_id',
                    Address.create('0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E').getValue() as Address,
                    Address.create('0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E').getValue() as Address,
                    '10000000000000000',
                    'hash_lock',
                    dayjs().add(10, 'day').toDate(),
                )
                repository.create(deposit)
                contractRepository.addTxHash(txHash)
                const command = new CreateDeposit(txHash,'contract_id')

                const depositOrError = (await handler.execute(command))
                expect(depositOrError.isLeft()).true
                expect(depositOrError.value).instanceof(DepositAlreadyExists)
            })
        })
    });
});
