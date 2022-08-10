import {expect} from "chai";
import StubRepository from "../../../../../../Context/Revpop/Infrastructure/StubRepository";
import CreateDepositHandler
    from "../../../../../../Context/Revpop/Application/Command/CreateDeposit/CreateDepositHandler";
import CreateDeposit from "../../../../../../Context/Revpop/Application/Command/CreateDeposit/CreateDeposit";

describe("Revpop CreateDepositHandler", () => {
    let repository: StubRepository;
    let handler: CreateDepositHandler;

    beforeEach(function() {
        repository = new StubRepository()
        handler = new CreateDepositHandler(repository);
    });

    describe("execute", () => {
        it("should save new deposit", async () => {
            const command = new CreateDeposit(
                "0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f",
                "revpopAccount"
            )
            const depositOrError = handler.execute(command)

            expect(repository.size).equals(1)
            expect(depositOrError.isLeft()).false
            expect(depositOrError.isRight()).true
        });
    });
});
