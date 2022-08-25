import {expect} from 'chai';
import RevpopAccount from "../../../../Context/Revpop/Domain/RevpopAccount";

describe('Revpop::RevpopAccount', () => {
    describe('create new', () => {
        it('valid revpop account', () => {
            const txHashOrError = RevpopAccount.create('0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f')

            expect(txHashOrError.isSuccess).true
        })

        describe('invalid revpop account', () => {
            it('empty', () => {
                const txHashOrError = RevpopAccount.create('')

                expect(txHashOrError.isSuccess).false
            })
        })

    });
});
