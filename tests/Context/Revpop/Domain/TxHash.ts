import {expect} from 'chai';
import TxHash from '../../../../Context/Revpop/Domain/TxHash';

describe('Revpop::TxHash', () => {
    describe('create new', () => {
        it('valid transaction hash', () => {
            const txHashOrError = TxHash.create('0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f')

            expect(txHashOrError.isSuccess).true
        })

        describe('invalid transaction hash', () => {
            it('empty transaction', () => {
                const txHashOrError = TxHash.create('')

                expect(txHashOrError.isSuccess).false
            })

            it('invalid transaction hash', () => {
                const txHashOrError = TxHash.create('invalid_hash')

                expect(txHashOrError.isSuccess).false
            })
        })

    });
});
