import {expect} from "chai";
import Deposit from "../../../../Context/Revpop/Domain/Deposit";
import TxHash from "../../../../Context/Revpop/Domain/TxHash";
import RevpopAccount from "../../../../Context/Revpop/Domain/RevpopAccount";

describe("Revpop Deposit", () => {
    describe("create new", () => {
        const txHash = TxHash.create('0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f').getValue() as TxHash
        const revpopAccount = RevpopAccount.create('revpop_account').getValue() as RevpopAccount

        const deposit = Deposit.create(txHash, revpopAccount)

        expect(deposit.txHash.equals(txHash))
        expect(deposit.revpopAccount.equals(revpopAccount))
    });
});
