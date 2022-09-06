import StubRepository from '../../../../../../Context/Wallet/Infrastructure/StubRepository';
import ConfirmDepositHandler
    from '../../../../../../Context/Wallet/Application/Command/ConfirmDeposit/ConfirmDepositHandler';
import {ConfirmDeposit} from '../../../../../../Context/Wallet';
import web3SecretGenerator from '../../../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator';
import {expect} from 'chai';
import Deposit from '../../../../../../Context/Wallet/Domain/Deposit';
import {DepositNotFoundError} from '../../../../../../Context/Wallet/Application/Command/ConfirmDeposit/Errors';
import SessionId from '../../../../../../Context/Wallet/Domain/SessionId';

describe('Wallet::ConfirmDepositHandler', () => {
    let repository: StubRepository;
    let handler: ConfirmDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new ConfirmDepositHandler(repository);
    });

    describe('execute', () => {
        it('should confirm deposit', async () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = Deposit.create(
                SessionId.create(sessionId).getValue() as SessionId
            )
            repository.create(deposit)

            const command = new ConfirmDeposit(
                deposit.sessionId.value,
                '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f',
                'revpop_account_name',
                '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
            )
            const result = await handler.execute(command)

            expect(result.isLeft()).false
            expect(result.isRight()).true
        });

        it('should return error if session id is not existed', async () => {
            const command = new ConfirmDeposit(
                web3SecretGenerator.generate(),
                'revpop_account_name',
                'tx_hash',
                'hash_lock'
            )
            const result = await handler.execute(command)

            expect(result.isLeft()).true
            expect(result.value).is.instanceof(DepositNotFoundError)
        });
    });
});
