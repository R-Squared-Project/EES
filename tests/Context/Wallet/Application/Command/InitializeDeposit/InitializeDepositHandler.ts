import {expect} from "chai";
import {InitializeDeposit, InitializeDepositHandler, StubRepository} from "../../../../../../Context/Wallet";

describe("InitializeDepositHandler", () => {
    let repository: StubRepository;
    let handler: InitializeDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new InitializeDepositHandler(repository);
    });

    describe("execute", () => {
        it("with secret", async () => {
            const command = new InitializeDeposit()
            handler.execute(command)

            expect(repository.size).equals(1)
        });
    });
});
