import WithdrawStubRepository from "context/Infrastructure/Stub/WithdrawStubRepository";
import ConfirmWithdrawExternalContractRedeemedHandler from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemedHandler";
import NotifierInterface from "context/Notifier/NotifierInterface";
import Setting from "context/Setting/Setting";
import ConfirmWithdrawExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemed";
import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import ConsoleNotifier from "context/Notifier/ConsoleNotifier";
import Withdraw, {
    STATUS_READY_TO_SIGN,
    STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN,
    STATUS_REDEEMED,
} from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import InternalContract from "context/Domain/InternalContract";
import { expect } from "chai";
import Contract from "context/ExternalBlockchain/Contract";
import ExternalContract from "context/Domain/ExternalContract";
import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Address from "context/Domain/ValueObject/Address";
import HashLock from "context/Domain/ValueObject/HashLock";
import TimeLock from "context/Domain/ValueObject/TimeLock";

describe("ConfirmWithdrawExternalContractRedeemedHandler", () => {
    let withdrawRepository: WithdrawStubRepository;
    let externalBlockchain: StubRepository;
    let notifier: NotifierInterface;
    let setting: Setting;
    let handler: ConfirmWithdrawExternalContractRedeemedHandler;
    let withdraw: Withdraw;
    let contract: Contract;
    let externalContract: ExternalContract;

    beforeEach(function () {
        withdrawRepository = new WithdrawStubRepository();
        externalBlockchain = new StubRepository();
        notifier = new ConsoleNotifier();
        setting = new Setting({
            repository: "stub",
        });

        handler = new ConfirmWithdrawExternalContractRedeemedHandler(
            withdrawRepository,
            externalBlockchain,
            notifier,
            setting
        );

        withdraw = new Withdraw(
            WithdrawRequest.create(
                RevpopAccount.create("revpop_account_name"),
                1,
                "0x0000000AddressOfUserInEthereum",
                1,
                "ETH"
            ),
            new InternalContract("0x123InternalContract"),
            "0x123CreateOperationId",
            "0x123TransferOperationId"
        );

        withdrawRepository.save(withdraw);

        contract = new Contract(
            "0x123ContractId",
            "0x123Sender",
            "0x123Receiver",
            "0x123Value",
            "0x123HashLock",
            1,
            true,
            false,
            "0x123Preimage"
        );

        externalBlockchain._contract = contract;

        externalContract = new ExternalContract(
            new UniqueEntityID("0x123ExternalContractId"),
            Address.create("0xabc1234567890123456789012345678901234567"),
            Address.create("0xbcd1234567890123456789012345678901234567"),
            "0x123Value",
            HashLock.create("0xcdfabc1234567890123456789012345678901234567abc123456789012345678"),
            TimeLock.fromDate(new Date()),
            "0x123TxHash"
        );

        withdraw.externalContract = externalContract;
        withdraw.status = STATUS_READY_TO_SIGN;

        externalBlockchain._transactionReceipt = {
            status: true,
            transactionHash: "0x123TxHash",
            transactionIndex: 1,
            blockHash: "0x123BlockHash",
            blockNumber: 1,
            from: "0x123From",
            to: "0x123To",
            cumulativeGasUsed: 1,
            gasUsed: 1,
            effectiveGasPrice: 1,
            logs: [],
            logsBloom: "0x123LogsBloom",
        };
    });

    describe("execute", () => {
        describe("success", () => {
            it("should redeemed withdraw", async () => {
                await handler.execute(
                    new ConfirmWithdrawExternalContractRedeemed("0x123TxHash", externalContract.idString)
                );
                expect(withdraw.status).eq(STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN);
                expect(withdraw.externalBlockchainRedeemTxHash).eq("0x123TxHash");
            });
        });
        describe("error", () => {
            it("should return error if withdraw non exist", () => {
                const command = new ConfirmWithdrawExternalContractRedeemed("0x123", "0x123");
                expect(handler.execute(command)).rejectedWith("Withdraw not exists");
            });
        });
    });
});
