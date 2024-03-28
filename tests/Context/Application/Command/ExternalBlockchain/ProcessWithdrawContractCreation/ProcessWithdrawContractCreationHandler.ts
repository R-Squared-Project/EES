import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import WithdrawStubRepository from "context/Infrastructure/Stub/WithdrawStubRepository";
import ProcessWithdrawContractCreationHandler from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreationHandler";
import Withdraw, { STATUS_READY_TO_SIGN, STATUS_SEND_IN_REPLY } from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import NativeAccount from "context/Domain/ValueObject/NativeAccount";
import InternalContract from "context/Domain/InternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Contract from "context/ExternalBlockchain/Contract";
import ProcessWithdrawContractCreation from "context/Application/Command/ExternalBlockchain/ProcessWithdrawContractCreation/ProcessWithdrawContractCreation";
import { expect } from "chai";
import config from "context/config";
import dayjs from "dayjs";
import { HashZero } from "@ethersproject/constants";

describe("ProcessWithdrawContractCreationHandler", () => {
    let contractId = "";
    let externalBlockchain: ExternalBlockchain;
    let stubRepository: StubRepository;
    let withdrawRepository: WithdrawStubRepository;
    let handler: ProcessWithdrawContractCreationHandler;
    let hashlock = "";
    let withdraw: Withdraw;
    let txHash = "";

    beforeEach(() => {
        txHash = "0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f";
        contractId = "0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c";
        externalBlockchain = new ExternalBlockchain("stub");
        stubRepository = externalBlockchain.repository as StubRepository;
        withdrawRepository = new WithdrawStubRepository();
        withdraw = new Withdraw(
            WithdrawRequest.create(NativeAccount.create("123"), 1, "0x123", 0.1, "RQRX"),
            new InternalContract("0x123"),
            "0x123",
            "0x123"
        );
        withdraw.id = new UniqueEntityID("123");
        withdraw.txHash = txHash;
        withdrawRepository.save(withdraw);
        stubRepository._contract = new Contract(
            contractId,
            config.eth.receiver,
            "0x1234567890123456789012345678901234567890",
            config.eth.minimum_deposit_amount.addn(0.01).toString(),
            "0x1234567890123456789012345678901234567890123456789012345678901234",
            dayjs()
                .add(config.contract.minimum_timelock + 5, "minutes")
                .unix(),
            false,
            false,
            HashZero
        );
        handler = new ProcessWithdrawContractCreationHandler(withdrawRepository, externalBlockchain);
    });
    describe("execute", () => {
        describe("success", () => {
            it("should not process withdraw", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                const command = new ProcessWithdrawContractCreation(
                    withdraw.hashlock ?? "",
                    withdraw.txHash ?? "",
                    stubRepository._contract?.contractId ?? ""
                );
                await handler.execute(command);
                expect(withdraw.externalContract?.idString).equal(stubRepository._contract?.contractId);
                expect(withdraw.externalContract?.sender.value).equal(stubRepository._contract?.sender);
                expect(withdraw.externalContract?.receiver.value).equal(stubRepository._contract?.receiver);
                expect(withdraw.externalContract?.value).equal(stubRepository._contract?.value);
                expect(withdraw.externalContract?.hashLock.value).equal(stubRepository._contract?.hashLock);
                expect(withdraw.externalContract?.timeLock.value.unix()).equal(stubRepository._contract?.timeLock);
                expect(withdraw.externalContract?.txHash).equal(command.txHash);
                expect(withdraw.status).equal(STATUS_READY_TO_SIGN);
            });
        });
        describe("error", () => {
            it("should return error if transaction not found in blockchain", async () => {
                stubRepository._txIncluded = false;
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(
                    `The transaction with hash "${txHash}" was not found in blockchain.`
                );
            });

            it("should return error if external contract not exists", async () => {
                stubRepository._txIncluded = true;
                stubRepository._contract = null;
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(
                    `The external contract "${command.contractId}" is not exists in the blockchain.`
                );
            });

            it("should return error if withdraw not exists", async () => {
                stubRepository._txIncluded = true;
                txHash = "0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729g";
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(`The withdraw with txHash "${txHash}" not exists.`);
            });

            it("should return error if withdraw is not ready to sign", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_READY_TO_SIGN;
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(
                    `WithdrawId: ${withdraw.id}. Status ${withdraw.status} is invalid.`
                );
            });

            it("should return error if withdraw sender is invalid", async () => {
                stubRepository._txIncluded = true;
                stubRepository._contract = new Contract(
                    contractId,
                    "0x123",
                    "0x1234567890123456789012345678901234567890",
                    config.eth.minimum_deposit_amount.addn(0.01).toString(),
                    "0x1234567890123456789012345678901234567890123456789012345678901234",
                    dayjs()
                        .add(config.contract.minimum_timelock + 5, "minutes")
                        .unix(),
                    false,
                    false,
                    HashZero
                );
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(`The sender is invalid.`);
            });

            it("should return error if withdraw value is invalid", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                stubRepository._contract = new Contract(
                    contractId,
                    config.eth.receiver,
                    "0x1234567890123456789012345678901234567890",
                    "0.0001",
                    "0x1234567890123456789012345678901234567890123456789012345678901234",
                    dayjs()
                        .add(config.contract.minimum_timelock + 5, "minutes")
                        .unix(),
                    false,
                    false,
                    HashZero
                );
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(
                    `The deposit ${
                        stubRepository._contract?.value
                    } is too small. Minimum deposit is ${config.eth.minimum_withdraw_amount.toString()}.`
                );
            });

            it("should return error if withdraw is already withdrawn", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                stubRepository._contract = new Contract(
                    contractId,
                    config.eth.receiver,
                    "0x1234567890123456789012345678901234567890",
                    config.eth.minimum_deposit_amount.addn(0.01).toString(),
                    "0x1234567890123456789012345678901234567890123456789012345678901234",
                    dayjs()
                        .add(config.contract.minimum_timelock + 5, "minutes")
                        .unix(),
                    true,
                    false,
                    HashZero
                );
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(`Contract is already withdrawn.`);
            });

            it("should return error if withdraw is already refunded", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                stubRepository._contract = new Contract(
                    contractId,
                    config.eth.receiver,
                    "0x1234567890123456789012345678901234567890",
                    config.eth.minimum_deposit_amount.addn(0.01).toString(),
                    "0x1234567890123456789012345678901234567890123456789012345678901234",
                    dayjs()
                        .add(config.contract.minimum_timelock + 5, "minutes")
                        .unix(),
                    false,
                    true,
                    HashZero
                );
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(`Contract is already refunded.`);
            });

            it("should return error if withdraw preimage is not empty", async () => {
                stubRepository._txIncluded = true;
                withdraw.status = STATUS_SEND_IN_REPLY;
                stubRepository._contract = new Contract(
                    contractId,
                    config.eth.receiver,
                    "0x1234567890123456789012345678901234567890",
                    config.eth.minimum_deposit_amount.addn(0.01).toString(),
                    "0x1234567890123456789012345678901234567890123456789012345678901234",
                    dayjs()
                        .add(config.contract.minimum_timelock + 5, "minutes")
                        .unix(),
                    false,
                    false,
                    "0x1234567890123456789012345678901234567890123456789012345678901234"
                );
                const command = new ProcessWithdrawContractCreation(hashlock, txHash, contractId);
                await expect(handler.execute(command)).rejectedWith(`Preimage is not empty.`);
            });
        });
    });
});
