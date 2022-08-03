import StubRepository from "../../../../../../Context/Wallet/Infrastructure/StubRepository";
import ConfirmDepositHandler
    from "../../../../../../Context/Wallet/Application/Command/ConfirmDeposit/ConfirmDepositHandler";
import {ConfirmDeposit} from "../../../../../../Context/Wallet";
import web3SecretGenerator from "../../../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator";
import {expect} from "chai";
import Deposit from "../../../../../../Context/Wallet/Domain/Deposit";
import {DepositNotFoundError} from "../../../../../../Context/Wallet/Application/Command/ConfirmDeposit/Errors";

describe("ConfirmDepositHandler", () => {
    let repository: StubRepository;
    let handler: ConfirmDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new ConfirmDepositHandler(repository);
    });

    describe("execute", () => {
        it("should confirm deposit", async () => {
            const sessionId = web3SecretGenerator.generate()
            const deposit = new Deposit(sessionId)
            repository.create(deposit)

            const command = new ConfirmDeposit(deposit.sessionId, "revpop_account_name", "tx_hash")
            const result = await handler.execute(command)

            expect(result.isLeft()).false
            expect(result.isRight()).true
        });

        it("should return error if session id is not existed", async () => {
            const command = new ConfirmDeposit(web3SecretGenerator.generate(), "revpop_account_name", "tx_hash")
            const result = await handler.execute(command)

            expect(result.isLeft()).true
            expect(result.value).is.instanceof(DepositNotFoundError)
        });
    });
});
