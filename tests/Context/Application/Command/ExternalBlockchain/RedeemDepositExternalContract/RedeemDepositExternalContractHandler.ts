import { expect } from "chai";
import dayjs from "dayjs";
import Deposit from "context/Domain/Deposit";
import ExternalContract from "context/Domain/ExternalContract";
import DepositStubRepository from "context/Infrastructure/Stub/DepositRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import ExternalBlockchainStubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import RedeemDepositExternalContract from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContract";
import RedeemDepositExternalContractHandler from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContractHandler";
import * as Errors from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/Errors";
import * as ErrorsDomain from "context/Domain/Errors";
import { createContract } from "tests/Helpers/ExternalBlockchain/Contract";
import { createDeposit } from "tests/Helpers/Deposit";
import { createInternalContract } from "tests/Helpers/InternalContract";
import { createExternalContract } from "tests/Helpers/ExternalContract";
import config from "context/config";

describe("RedeemDepositExternalContractHandler", () => {
    let depositRepository: DepositStubRepository;
    let externalBlockchain: ExternalBlockchain;
    let externalBlockchainRepository: ExternalBlockchainStubRepository;
    let handler: RedeemDepositExternalContractHandler;

    // const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
    // const timeLock = dayjs().add(10, 'day').unix()
    // const value = '10000000000000000'

    beforeEach(function () {
        depositRepository = new DepositStubRepository();
        externalBlockchain = new ExternalBlockchain("stub");
        externalBlockchainRepository = externalBlockchain.repository as ExternalBlockchainStubRepository;

        handler = new RedeemDepositExternalContractHandler(depositRepository, externalBlockchain);
    });

    describe("execute", () => {
        describe("success", () => {
            const contractId = "0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c";
            const secret = "9ba1896f3f462f454bb52e886f730de572664efa07b34001ffc2277d5ab24347";

            let externalContract: ExternalContract;
            let deposit: Deposit;

            beforeEach(() => {
                externalContract = createExternalContract({
                    id: contractId,
                });
                deposit = createDeposit({
                    externalContract,
                });
                deposit.submittedToInternalBlockchain("1000000");
                deposit.createdInInternalBlockchain(createInternalContract());
                deposit.redeemedInInternalBlockchain(secret);
                depositRepository.create(deposit);
            });

            it("should redeem deposit", async () => {
                const command = new RedeemDepositExternalContract(deposit.idString);
                await expect(handler.execute(command)).fulfilled;
            });

            it("should use send correct request to an external blockchain", async () => {
                const command = new RedeemDepositExternalContract(deposit.idString);
                await handler.execute(command);

                expect(externalBlockchainRepository._redeemedRequests).length(1);

                const redeemRequest = externalBlockchainRepository._redeemedRequests[0];
                expect(redeemRequest.contractId).equals(contractId);
                expect(redeemRequest.receiver).equals(config.eth.receiver);
                expect(redeemRequest.secret).equals(
                    "0x39626131383936663366343632663435346262353265383836663733306465353732363634656661303762333430303166666332323737643561623234333437"
                );
            });
        });

        describe("error", () => {
            it("should throw an error if the deposit does not exist", async () => {
                const command = new RedeemDepositExternalContract("invalid_deposit_id");
                await expect(handler.execute(command)).rejectedWith(Errors.DepositNotExists);
            });

            it("should throw error if deposit status is invalid (and secret is empty)", async () => {
                const deposit = createDeposit();
                depositRepository.create(deposit);

                const command = new RedeemDepositExternalContract(deposit.idString);
                await expect(handler.execute(command)).rejectedWith(
                    ErrorsDomain.RedeemExecutedInExternalBlockchainStatusError
                );
            });
        });
    });
});
