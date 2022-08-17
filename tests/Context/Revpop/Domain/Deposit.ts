import {expect} from "chai";
import Deposit from "../../../../Context/Revpop/Domain/Deposit";
import TxHash from "../../../../Context/Revpop/Domain/TxHash";
import RevpopAccount from "../../../../Context/Revpop/Domain/RevpopAccount";

describe("Revpop Deposit", () => {
    it("should create new deposit by user", () => {
        const txHash = TxHash.create('0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f').getValue() as TxHash
        const revpopAccount = RevpopAccount.create('revpop_account').getValue() as RevpopAccount

        const deposit = Deposit.createByUser(txHash, revpopAccount)

        expect(deposit.txHash.equals(txHash))
        expect(deposit.revpopAccount).not.null
        expect((deposit.revpopAccount as RevpopAccount).equals(revpopAccount))
    });

    it("should create new deposit by blockchain", () => {
        const txHash = TxHash.create('0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f').getValue() as TxHash
        const revpopAccount = RevpopAccount.create('revpop_account').getValue() as RevpopAccount

        const deposit = Deposit.createByBlockchain(txHash)

        expect(deposit.txHash.equals(txHash))
        expect(deposit.revpopAccount).null
    });
});
