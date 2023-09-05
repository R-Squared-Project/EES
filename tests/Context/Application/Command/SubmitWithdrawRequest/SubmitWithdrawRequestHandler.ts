import SubmitWithdrawRequestHandler from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequestHandler";
import WithdrawRequestRepository from "context/Infrastructure/Stub/WithdrawRequestRepository";
import SubmitWithdrawRequest from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequest";
import { expect } from "chai";
import { RevpopAccountValidationError, WithdrawRequestValidationError } from "context/Domain/Errors";

describe("SubmitWithdrawRequestHandler", () => {
    let repository: WithdrawRequestRepository;
    let handler: SubmitWithdrawRequestHandler;
    const internalAccount = "revpop_account_name";

    beforeEach(function () {
        repository = new WithdrawRequestRepository();
        handler = new SubmitWithdrawRequestHandler(repository);
    });

    describe("execute", () => {
        describe("success", () => {
            it("should save new withdraw request", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 1, "0x0000000", 1, "ETH");

                await expect(handler.execute(command)).fulfilled;
                expect(repository).repositorySize(1);
            });
        });

        describe("error", () => {
            it("should return error if account is empty", async () => {
                const command = new SubmitWithdrawRequest("", 1, "0x0000000", 1, "ETH");

                await expect(handler.execute(command)).rejectedWith(RevpopAccountValidationError);
            });

            it("should return error if amount to pay in RVETH is empty", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 0, "0x0000000", 1, "ETH");

                await expect(handler.execute(command)).rejectedWith(
                    WithdrawRequestValidationError,
                    "Amount to pay in RVETH can not be negative or zero"
                );
            });

            it("should return error if address of user in Ethereum is empty", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 1, "", 1, "ETH");

                await expect(handler.execute(command)).rejectedWith(
                    WithdrawRequestValidationError,
                    "Address of user in Ethereum can not be empty"
                );
            });

            it("should return error if withdrawal fee amount is empty", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 1, "0x0000000", 0, "ETH");

                await expect(handler.execute(command)).rejectedWith(
                    WithdrawRequestValidationError,
                    "Withdrawal fee amount can not be negative or zero"
                );
            });

            it("should return error if withdrawal fee currency is empty", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 1, "0x0000000", 1, "");

                await expect(handler.execute(command)).rejectedWith(
                    WithdrawRequestValidationError,
                    "Withdrawal fee currency can not be empty"
                );
            });

            it("should return error if withdrawal fee currency is invalid", async () => {
                const command = new SubmitWithdrawRequest(internalAccount, 1, "0x0000000", 1, "");

                await expect(handler.execute(command)).rejectedWith(
                    WithdrawRequestValidationError,
                    "Withdrawal fee currency can not be empty"
                );
            });

            it("should return error if withdrawal account is wrong", async () => {
                const command = new SubmitWithdrawRequest("", 1, "0x0000000", 1, "ETH");

                await expect(handler.execute(command)).rejectedWith(
                    RevpopAccountValidationError,
                    'Account name "" is invalid: Revpop account can not be empty'
                );
            });
        });
    });
});
