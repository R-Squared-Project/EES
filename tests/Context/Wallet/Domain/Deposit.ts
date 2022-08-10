import {expect} from "chai";
import Deposit from "../../../../Context/Wallet/Domain/Deposit";
import web3SecretGenerator from "../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator";
import DepositInitializedEvent from "../../../../Context/Wallet/Domain/Event/DepositInitializedEvent";
import DepositConfirmedEvent from "../../../../Context/Wallet/Domain/Event/DepositConfirmedEvent";
import SessionId from "../../../../Context/Wallet/Domain/SessionId";

describe("Deposit", () => {
    describe("create new", () => {
        it("should contain correct secret", () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = Deposit.create(
                SessionId.create(sessionId).getValue() as SessionId
            )

            expect(deposit.sessionId.value).equals(sessionId)
        })
    });

    describe("confirm", () => {
        it("new deposit could be confirmed", () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = Deposit.create(
                SessionId.create(sessionId).getValue() as SessionId
            )

            const resultOrError = deposit.confirm("revpop_account_name", "tx_hash")

            expect(resultOrError.isRight()).true
            expect(deposit.domainEvents.length).equals(2)
            expect(deposit.domainEvents[0]).instanceof(DepositInitializedEvent)
            expect(deposit.domainEvents[1]).instanceof(DepositConfirmedEvent)
        })
    });
});
