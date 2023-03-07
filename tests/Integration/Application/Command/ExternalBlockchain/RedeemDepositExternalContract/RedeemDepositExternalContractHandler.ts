import {expect} from "chai";
import {dataSourceTest} from "tests/Integration/hooks";
import DepositRequestRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import DepositRepository from "context/Infrastructure/TypeORM/DepositRepository";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import RedeemDepositExternalContractHandler
    from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContractHandler";
import RedeemDepositExternalContract
    from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/RedeemDepositExternalContract";
import * as Errors from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/Errors";
import {createDeposit} from "tests/Helpers/Deposit";
import StubRepository from "context/ExternalBlockchain/Repository/StubRepository";
import {ConnectionError} from "context/ExternalBlockchain/Errors";
import Deposit, { STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN } from "context/Domain/Deposit";
import { createDepositRequest } from "tests/Helpers/DepositRequest";
import { createInternalContract } from "tests/Helpers/InternalContract";
import { createExternalContract } from "tests/Helpers/ExternalContract";

describe('RedeemDepositExternalContractHandler', async () => {
    let depositRequestRepository: DepositRequestRepository
    let depositRepository: DepositRepository
    let externalBlockchainRepository: StubRepository
    let handler: RedeemDepositExternalContractHandler

    before(async () => {
        depositRequestRepository = new DepositRequestRepository(dataSourceTest)
        depositRepository = new DepositRepository(dataSourceTest)
        const externalBlockchain = new ExternalBlockchain('stub')
        externalBlockchainRepository = externalBlockchain.repository as StubRepository
        handler = new RedeemDepositExternalContractHandler(depositRepository, externalBlockchain)
    })

    describe('success', async () => {
        let deposit: Deposit
        const contractId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
        const secret = '9ba1896f3f462f454bb52e886f730de572664efa07b34001ffc2277d5ab24347'

        beforeEach(async () => {
            const depositRequest = createDepositRequest()
            await depositRequestRepository.create(depositRequest)
            const externalContract = createExternalContract({
                id: contractId
            })
            deposit = createDeposit({depositRequest, externalContract})
            deposit.submittedToInternalBlockchain()
            deposit.createdInInternalBlockchain(createInternalContract())
            deposit.redeemedInInternalBlockchain(secret)
            await depositRepository.create(deposit)
        })
        it('should redeem external contract', async () => {
            externalBlockchainRepository._redeemTxHash = 'redeem_tx_hash'

            const command = new RedeemDepositExternalContract(deposit.id.toValue().toString())
            await expect(handler.execute(command)).fulfilled

            const updatedDeposit = await depositRepository.getById(deposit.idString)
            expect(updatedDeposit?.status).equals(STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN)
            expect(updatedDeposit?.externalBlockchainRedeemTxHash).equals('redeem_tx_hash')
        })
    })
});
