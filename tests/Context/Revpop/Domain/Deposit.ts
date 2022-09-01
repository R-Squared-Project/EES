import {expect} from 'chai';
import Deposit from '../../../../Context/Revpop/Domain/Deposit';
import TxHash from '../../../../Context/Revpop/Domain/TxHash';
import RevpopAccount from '../../../../Context/Revpop/Domain/RevpopAccount';
import HashLock from "../../../../Context/Revpop/Domain/HashLock";

describe('Revpop::Deposit', () => {
    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'
    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    it('should create new deposit by user', () => {
        const txHashOrError = TxHash.create(txHash).getValue() as TxHash
        const revpopAccount = RevpopAccount.create('revpop_account').getValue() as RevpopAccount

        const deposit = Deposit.createByUser(
            txHashOrError as TxHash,
            revpopAccount,
            HashLock.create(hashLock).getValue() as HashLock
        )

        expect(deposit.txHash.equals(txHashOrError)).true
        expect(deposit.revpopAccount).not.null
        expect((deposit.revpopAccount as RevpopAccount).equals(revpopAccount))
    });

    it('should create new deposit by blockchain', () => {
        const txHashOrError = TxHash.create(txHash).getValue() as TxHash
        const hashLockOrError = HashLock.create(hashLock).getValue() as HashLock

        const deposit = Deposit.createByBlockchain(txHashOrError, '1000', hashLockOrError)

        expect(deposit.txHash.equals(txHashOrError)).true
        expect(deposit.revpopAccount).null
    });
});
