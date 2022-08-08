import {expect} from "chai";
import Deposit from "../../../../Context/Wallet/Domain/Deposit";
import web3SecretGenerator from "../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator";
import DepositInitializedEvent from "../../../../Context/Wallet/Domain/Event/DepositInitializedEvent";
import DepositConfirmedEvent from "../../../../Context/Wallet/Domain/Event/DepositConfirmedEvent";

describe("Deposit", () => {
    describe("create new", () => {
        it("should contain correct secret", () => {
            const secret = web3SecretGenerator.generate()
            const deposit = Deposit.create(secret)

            expect(deposit.sessionId.id.toValue()).equals(secret)
        })
    });

    describe("confirm", () => {
        it("new deposit could be confirmed", () => {
            const secret = web3SecretGenerator.generate()
            const deposit = Deposit.create(secret)

            const resultOrError = deposit.confirm("revpop_account_name", "tx_hash")

            expect(resultOrError.isRight()).true
            expect(deposit.domainEvents.length).equals(2)
            expect(deposit.domainEvents[0]).instanceof(DepositInitializedEvent)
            expect(deposit.domainEvents[1]).instanceof(DepositConfirmedEvent)
        })
    });
});
