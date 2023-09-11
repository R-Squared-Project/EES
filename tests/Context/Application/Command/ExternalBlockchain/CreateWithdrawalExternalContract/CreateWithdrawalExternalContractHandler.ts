import WithdrawStubRepository from "context/Infrastructure/Stub/WithdrawStubRepository";
import ExternalStubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import InternalStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import WrappedEtherToEtherConverter from "context/Infrastructure/WrappedEtherToEtherConverter";
import AssetNormalizer from "context/Infrastructure/AssetNormalizer";
import CreateWithdrawalExternalContractHandler from "context/Application/Command/ExternalBlockchain/CreateWithdrawalExternalContract/CreateWithdrawalExternalContractHandler";
import Withdraw, { STATUS_READY_TO_PROCESS } from "context/Domain/Withdraw";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccount from "context/Domain/ValueObject/RevpopAccount";
import InternalContract from "context/Domain/InternalContract";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import dayjs from "dayjs";

describe("CreateWithdrawExternalContractHandler", () => {
    let withdrawRepository: WithdrawStubRepository;
    let externalBlockchain: ExternalBlockchain;
    let internalBlockchain: InternalBlockchain;
    let wrappedEtherToEtherConverter: WrappedEtherToEtherConverter;
    let normalizer: AssetNormalizer;
    let withdraw: Withdraw;
    let handler: CreateWithdrawalExternalContractHandler;

    beforeEach(function () {
        withdrawRepository = new WithdrawStubRepository();
        externalBlockchain = new ExternalBlockchain("stub");
        internalBlockchain = new InternalBlockchain(new InternalStubRepository());
        wrappedEtherToEtherConverter = new WrappedEtherToEtherConverter();
        normalizer = new AssetNormalizer();

        handler = new CreateWithdrawalExternalContractHandler(
            withdrawRepository,
            externalBlockchain,
            internalBlockchain,
            wrappedEtherToEtherConverter,
            normalizer
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

        withdraw.status = STATUS_READY_TO_PROCESS;
        withdraw.internalContract.createdAt = dayjs().subtract(1, "day").toDate();
        withdraw.amountOfHTLC = 0.01;
        withdraw.timelock = 1;

        withdrawRepository.save(withdraw);
    });
});
