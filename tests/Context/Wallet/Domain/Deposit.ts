import {expect} from 'chai';
import Deposit from '../../../../Context/Wallet/Domain/Deposit';
import web3SecretGenerator from '../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator';
import DepositInitializedEvent from '../../../../Context/Wallet/Domain/Event/DepositInitializedEvent';
import DepositConfirmedEvent from '../../../../Context/Wallet/Domain/Event/DepositConfirmedEvent';
import SessionId from '../../../../Context/Wallet/Domain/SessionId';
import RevpopAccount from '../../../../Context/Wallet/Domain/RevpopAccount';
import TxHash from "../../../../Context/Wallet/Domain/TxHash";

describe('Wallet::Deposit', () => {
    describe('create new', () => {
        it('should contain correct secret', () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = Deposit.create(
                SessionId.create(sessionId).getValue() as SessionId
            )

            expect(deposit.sessionId.value).equals(sessionId)
        })
    });

    describe('confirm', () => {
        it('new deposit should be confirmed', () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = Deposit.create(
                SessionId.create(sessionId).getValue() as SessionId
            )

            const revpopAccountOrError = RevpopAccount.create('revpop_account_name').getValue() as RevpopAccount
            const txHashOrError = TxHash.create('tx_hash').getValue() as TxHash

            const resultOrError = deposit.confirm(revpopAccountOrError, txHashOrError, 'hash_lock')

            expect(resultOrError.isRight()).true
            expect(deposit.domainEvents.length).equals(2)
            expect(deposit.domainEvents[0]).instanceof(DepositInitializedEvent)
            expect(deposit.domainEvents[1]).instanceof(DepositConfirmedEvent)
        })
    });
});
