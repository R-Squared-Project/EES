import {expect} from "chai";
import Deposit from "../../../../Context/Wallet/Domain/Deposit";
import web3SecretGenerator from "../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator";

describe("Deposit", () => {
    describe("create new", () => {
        it("should contain correct secret", () => {
            const secret = web3SecretGenerator.generate()
            const deposit = new Deposit(secret)

            expect(deposit.sessionId).equals(secret)
        })
    });

    describe("confirm", () => {
        it("new deposit could be confirmed", () => {
            const secret = web3SecretGenerator.generate()
            const deposit = new Deposit(secret)

            deposit.confirm("revpop_account_name")
        })
    });
});
