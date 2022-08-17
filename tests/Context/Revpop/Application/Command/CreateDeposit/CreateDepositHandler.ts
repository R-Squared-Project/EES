import {expect} from 'chai';
import StubRepository from '../../../../../../Context/Revpop/Infrastructure/StubRepository';
import CreateDepositHandler
    from '../../../../../../Context/Revpop/Application/Command/CreateDeposit/CreateDepositHandler';
import CreateDeposit from '../../../../../../Context/Revpop/Application/Command/CreateDeposit/CreateDeposit';
import Deposit from '../../../../../../Context/Revpop/Domain/Deposit';
import TxHash from '../../../../../../Context/Revpop/Domain/TxHash';
import RevpopAccount from '../../../../../../Context/Revpop/Domain/RevpopAccount';
import DepositConfirmedEvent from '../../../../../../Context/Revpop/Domain/Event/DepositConfirmedEvent';

describe('Revpop CreateDepositHandler', () => {
    let repository: StubRepository;
    let handler: CreateDepositHandler;
    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'

    beforeEach(function() {
        repository = new StubRepository()
        handler = new CreateDepositHandler(repository);
    });

    describe('execute', () => {
        describe('deposit is not created by blockchain', () => {
            it('should create new deposit', async () => {
                const command = new CreateDeposit(txHash,'revpopAccount')
                const depositOrError = await handler.execute(command)

                expect(depositOrError.isLeft()).false
                expect(depositOrError.isRight()).true
                expect(repository.size).equals(1)
            });

            it('DepositConfirmedEvent should not be added ', async () => {
                const command = new CreateDeposit(txHash, 'revpopAccount')
                await handler.execute(command)

                const deposit = await repository.getByTxHash(txHash)
                expect(deposit?.domainEvents).empty
            });
        })

        describe('deposit is created by blockchain', () => {
            let deposit: Deposit

            beforeEach(async () => {
                deposit = Deposit.createByUser(
                    TxHash.create(txHash).getValue() as TxHash,
                    RevpopAccount.create('revpop_account').getValue() as RevpopAccount
                )
                await repository.create(deposit)
            })

            it('should confirm deposit', async () => {
                const command = new CreateDeposit(txHash,'revpopAccount')
                const result = await handler.execute(command)

                expect(result.isLeft()).false
                expect(result.isRight()).true
            });

            it('DepositConfirmedEvent should be added', async () => {
                const command = new CreateDeposit(txHash,'revpopAccount')
                const result = await handler.execute(command)

                expect(deposit.domainEvents).length(1)
                expect(deposit.domainEvents[0]).instanceof(DepositConfirmedEvent)
            });
        })
    });
});
