import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import ExternalWithdrawRedeemHandler from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeemHandler";
import ExternalWithdrawRedeem from "context/Application/Command/ExternalBlockchain/MonitorExternalWithdrawRedeem/ExternalWithdrawRedeem";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import { expect } from "chai";
import StubQueue from "context/Queue/StubQueue";
import { EXTERNAL_WITHDRAW_CONTRACT_REDEEM } from "context/Queue/QueueInterface";

describe("ExternalWithdrawRedeemHandler", () => {
    let externalBlockchain: ExternalBlockchain;
    let stubRepository: StubRepository;
    let rabbitMQ: StubQueue;
    let handler: ExternalWithdrawRedeemHandler;
    beforeEach(() => {
        externalBlockchain = new ExternalBlockchain("stub");
        stubRepository = externalBlockchain.repository as StubRepository;
        rabbitMQ = new StubQueue();
        handler = new ExternalWithdrawRedeemHandler(externalBlockchain, rabbitMQ);
    });
    describe("execute", () => {
        describe("success", () => {
            it("should publish message", async () => {
                stubRepository._txIncluded = true;
                await handler.execute(new ExternalWithdrawRedeem("0x123", "0x123"));
                expect(rabbitMQ.key).equal(EXTERNAL_WITHDRAW_CONTRACT_REDEEM);
                expect(rabbitMQ.message.txHash).equal("0x123");
                expect(rabbitMQ.message.contractId).equal("0x123");
            });
        });
        describe("error", () => {
            it("should return error if transaction not found in blockchain", () => {
                stubRepository._txIncluded = false;
                const command = new ExternalWithdrawRedeem("0x123", "0x123");
                expect(handler.execute(command)).rejectedWith("Transaction not found in blockchain");
            });
        });
    });
});
