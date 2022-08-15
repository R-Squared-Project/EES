import {expect} from "chai";
import StubRepository from "../../../../../../Context/Wallet/Infrastructure/StubRepository";
import {InitializeDeposit} from "../../../../../../Context/Wallet";
import InitializeDepositHandler
    from "../../../../../../Context/Wallet/Application/Command/InitializeDeposit/InitializeDepositHandler";
import web3SecretGenerator from "../../../../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator";

describe("InitializeDepositHandler", () => {
    let repository: StubRepository;
    let handler: InitializeDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new InitializeDepositHandler(repository, web3SecretGenerator);
    });

    describe("execute", async () => {
        it("should save new deposit", async () => {
            const command = new InitializeDeposit()
            const depositOrError = await handler.execute(command)

            expect(repository.size).equals(1)
            expect(depositOrError.isLeft()).false
            expect(depositOrError.isRight()).true
        });
    });
});
