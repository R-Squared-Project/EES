import { expect } from "chai";
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import ConfirmDepositInternalContractRedeemed from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemed";
import ConfirmDepositInternalContractRedeemedHandler from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemedHandler";
import { createExternalContract } from "tests/Helpers/ExternalContract";
import { createDeposit } from "tests/Helpers/Deposit";
import * as Errors from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/Errors";
import * as DomainErrors from "context/Domain/Errors";
import { createInternalContract } from "tests/Helpers/InternalContract";
import { createDepositRequest } from "tests/Helpers/DepositRequest";
import { createOperationRedeem } from "tests/Helpers/InternalBlockchain/OperationRedeem";
import Deposit, {
    STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
    STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN,
} from "context/Domain/Deposit";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";

describe("ConfirmDepositInternalContractRedeemedHandler", () => {
    let depositRepository: DepositStubRepository;
    let handler: ConfirmDepositInternalContractRedeemedHandler;
    let internalBlockchain: InternalBlockchain;
    let internalBlockchainRepository: InternalBlockchainStubRepository;

    const internalAccountName = "internal_account_name";
    const externalContractId = "0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c";

    beforeEach(async () => {
        depositRepository = new DepositStubRepository();
        internalBlockchain = await InternalBlockchain.init({
            repository: "stub",
        });
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository;
        handler = new ConfirmDepositInternalContractRedeemedHandler(depositRepository, internalBlockchain);
    });

    describe("execute", () => {
        describe("success", () => {
            let deposit: Deposit;

            beforeEach(() => {
                deposit = createDeposit({
                    depositRequest: createDepositRequest(internalAccountName),
                    externalContract: createExternalContract({ id: externalContractId }),
                });
                deposit.submittedToInternalBlockchain("1000000");
                deposit.createdInInternalBlockchain(createInternalContract());
                depositRepository.create(deposit);
            });

            it("should not change status if redeem operation is not existed", async () => {
                const command = new ConfirmDepositInternalContractRedeemed(deposit.idString);
                await handler.execute(command);

                const updatedDeposit = await depositRepository.getById(deposit.id.toValue());
                expect(updatedDeposit?.status).equals(STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN);
            });

            it("should change status and save secret if redeem operation is existed", async () => {
                const secret = "b85a0e9f792cb3a9bc7dc75fdb1b795e91cf91ffddacc8d7869638079b02850b";
                internalBlockchainRepository.addRedeemOperation(
                    createOperationRedeem({
                        internalContractId: deposit.internalContract?.internalId,
                        secret,
                    })
                );
                const command = new ConfirmDepositInternalContractRedeemed(deposit.idString);
                await handler.execute(command);

                const updatedDeposit = await depositRepository.getById(deposit.id.toValue());
                expect(updatedDeposit?.status).equals(STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN);
                expect(updatedDeposit?.secret).equals(secret);
            });
        });

        describe("error", () => {
            let deposit: Deposit;

            it("should throw error if deposit with external id does not exist", async () => {
                const command = new ConfirmDepositInternalContractRedeemed("invalid_deposit_id");
                await expect(handler.execute(command)).rejectedWith(Errors.DepositNotFound);
            });
        });
    });
});
