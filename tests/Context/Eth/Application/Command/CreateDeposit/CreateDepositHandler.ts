import {expect} from 'chai';
import StubRepository from '../../../../../../Context/Eth/Infrastructure/StubRepository';
import CreateDepositHandler from '../../../../../../Context/Eth/Application/Command/CreateDeposit/CreateDepositHandler';
import {CreateDeposit} from '../../../../../../Context/Eth';
import dayjs from "dayjs";
import Deposit from "../../../../../../Context/Eth/Domain/Deposit";
import DepositCreatedEvent from "../../../../../../Context/Eth/Domain/Event/DepositCreatedEvent";

describe('Eth CreateDepositHandler', () => {
    let repository: StubRepository;
    let handler: CreateDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new CreateDepositHandler(repository);
    });

    describe('execute', () => {
        it('should save new deposit', async () => {
            const command = new CreateDeposit(
                '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f',
                'contract_id',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f8',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f9',
                '1000',
                'hash_lock',
                dayjs().add(1, 'day').unix()
            )

            const depositOrError = await handler.execute(command)

            expect(repository.size).equals(1)
            expect(depositOrError.isLeft()).false
            expect(depositOrError.isRight()).true
        });

        it('deposit should be correct', async () => {
            const command = new CreateDeposit(
                '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f',
                'contract_id',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f8',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f9',
                '1000',
                'hash_lock',
                dayjs().add(1, 'day').unix()

            )

            const deposit = (await handler.execute(command)).value.getValue() as Deposit

            expect(deposit.txHash.value).equals(command.txHash)
            expect(deposit.contractId).equals(command.contractId)
            expect(deposit.sender.value).equals(command.sender)
            expect(deposit.receiver.value).equals(command.receiver)
            expect(deposit.value).equals(command.value)
            expect(deposit.hashLock).equals(command.hashLock)
            expect(deposit.status).equals(1)
        });

        it('deposit should contain correct events', async () => {
            const command = new CreateDeposit(
                '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f',
                'contract_id',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f8',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f9',
                '1000',
                'hash_lock',
                dayjs().add(1, 'day').unix()

            )

            const deposit = (await handler.execute(command)).value.getValue() as Deposit

            expect(deposit.domainEvents).length(1)
            expect(deposit.domainEvents[0]).instanceof(DepositCreatedEvent)
        });

        it('should not create duplicate deposit', async () => {
            const command = new CreateDeposit(
                '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f',
                'contract_id',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f8',
                '0x757b8cFBf8bCD2D1c807f48e57552E45606917f9',
                '1000',
                'hash_lock',
                dayjs().add(1, 'day').unix()
            )

            await handler.execute(command)
            const depositOrError = (await handler.execute(command))
            expect(depositOrError.isLeft()).true
        })
    });
});
