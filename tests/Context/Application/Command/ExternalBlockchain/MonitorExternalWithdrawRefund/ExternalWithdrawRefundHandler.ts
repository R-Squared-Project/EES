import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import ExternalWithdrawRefundHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefundHandler";
import ExternalWithdrawRefund from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRefund/ExternalWithdrawRefund";
import WithdrawStubRepository from "context/Infrastructure/Stub/WithdrawStubRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { expect } from "chai";
import Withdraw, { STATUS_REFUND, STATUS_REFUNDED } from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import InternalContract from "context/Domain/InternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";

describe("ExternalWithdrawRefund", () => {
    let externalBlockchain: ExternalBlockchain;
    let stubRepository: StubRepository;
    let withdrawRepository: WithdrawStubRepository;
    let handler: ExternalWithdrawRefundHandler;
    let withdraw: Withdraw;
    beforeEach(() => {
        externalBlockchain = new ExternalBlockchain("stub");
        stubRepository = externalBlockchain.repository as StubRepository;
        withdrawRepository = new WithdrawStubRepository();
        withdraw = new Withdraw(
            WithdrawRequest.create(RevpopAccount.create("123"), 1, "0x123", 0.1, "RVP"),
            new InternalContract("0x123"),
            "0x123",
            "0x123"
        );
        withdraw.id = new UniqueEntityID("123");
        withdraw.externalBlockchainRefundTxHash = "0x123";
        withdrawRepository.save(withdraw);
        handler = new ExternalWithdrawRefundHandler(externalBlockchain, withdrawRepository);
    });
    describe("execute", () => {
        describe("success", () => {
            it("should not refund withdraw", () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_REFUND;
                handler.execute(new ExternalWithdrawRefund("0x124", "0x123"));
                expect(withdraw.status).equal(STATUS_REFUND);
            });
            it("should refund withdraw", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_REFUND;
                await handler.execute(new ExternalWithdrawRefund("0x123", "0x123"));
                expect(withdraw.status).equal(STATUS_REFUNDED);
            });
        });
        describe("error", () => {
            it("should return error if transaction not found in blockchain", () => {
                stubRepository._txIncluded = false;
                expect(handler.execute(new ExternalWithdrawRefund("0x123", "0x123"))).rejectedWith(
                    'The transaction with hash "0x123" was not found in blockchain.'
                );
            });
        });
    });
});
