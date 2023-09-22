import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import WithdrawStubRepository from "context/Infrastructure/Stub/WithdrawStubRepository";
import ProcessWithdrawContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreationHandler";
import Withdraw, { STATUS_READY_TO_SIGN, STATUS_SEND_IN_REPLY } from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import InternalContract from "context/Domain/InternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Contract from "context/ExternalBlockchain/Contract";
import ProcessWithdrawContractCreation from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreation";
import { expect } from "chai";
import config from "context/config";
import dayjs from "dayjs";

describe("ProcessWithdrawContractCreationHandler", () => {
    let externalBlockchain: ExternalBlockchain;
    let stubRepository: StubRepository;
    let withdrawRepository: WithdrawStubRepository;
    let handler: ProcessWithdrawContractCreationHandler;
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
        withdraw.txHash = "0x123";
        withdrawRepository.save(withdraw);
        stubRepository._contract = new Contract(
            "0x123",
            config.eth.receiver,
            "0x123",
            config.eth.minimum_deposit_amount.addn(0.01).toString(),
            "0x123",
            dayjs()
                .add(config.contract.minimum_timelock + 5, "minutes")
                .unix(),
            false,
            false,
            "0x123"
        );
        handler = new ProcessWithdrawContractCreationHandler(withdrawRepository, externalBlockchain);
    });
    describe("execute", () => {
        describe("success", () => {
            it("should not process withdraw", () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                const command = new ProcessWithdrawContractCreation("0x123", "0x123");
                handler.execute(command);
                expect(withdraw.externalContract?.idString).equal(stubRepository._contract?.contractId);
                expect(withdraw.externalContract?.sender).equal(stubRepository._contract?.sender);
                expect(withdraw.externalContract?.receiver).equal(stubRepository._contract?.receiver);
                expect(withdraw.externalContract?.value).equal(stubRepository._contract?.value);
                expect(withdraw.externalContract?.hashLock).equal(stubRepository._contract?.hashLock);
                expect(withdraw.externalContract?.timeLock).equal(stubRepository._contract?.timeLock);
                expect(withdraw.externalContract?.txHash).equal(command.txHash);
                expect(withdraw.status).equal(STATUS_READY_TO_SIGN);
            });
        });
        // describe("error", () => {
        //     it("should return error if transaction not found in blockchain", () => {
        //         stubRepository._txIncluded = false;
        //         expect(
        //             handler.execute({
        //                 txHash: "0x123",
        //                 contractId: "0x123",
        //             })
        //         ).rejectedWith('The transaction with hash "0x123" was not found in blockchain.');
        //     });
        // });
    });
});
