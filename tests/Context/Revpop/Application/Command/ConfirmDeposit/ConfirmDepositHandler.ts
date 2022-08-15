import {expect} from 'chai';
import StubRepository from '../../../../../../Context/Revpop/Infrastructure/StubRepository';
import {ConfirmDeposit} from '../../../../../../Context/Revpop';
import ConfirmDepositHandler
    from '../../../../../../Context/Revpop/Application/Command/ConfirmDeposit/ConfirmDepositHandler';
import Deposit from '../../../../../../Context/Revpop/Domain/Deposit';
import TxHash from '../../../../../../Context/Revpop/Domain/TxHash';
import RevpopAccount from '../../../../../../Context/Revpop/Domain/RevpopAccount';

describe('Revpop ConfirmDepositHandler', () => {
    let repository: StubRepository;
    let handler: ConfirmDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new ConfirmDepositHandler(repository);
    });

    describe('execute', () => {
        it('should confirm deposit', async () => {
            const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'

            const deposit = Deposit.create(
                TxHash.create(txHash).getValue() as TxHash,
                RevpopAccount.create('revpop_account').getValue() as RevpopAccount
            )
            await repository.create(deposit)

            const command = new ConfirmDeposit(txHash)

            const result = await handler.execute(command)

            expect(result.isLeft()).false
            expect(result.isRight()).true
        });
    });
});
