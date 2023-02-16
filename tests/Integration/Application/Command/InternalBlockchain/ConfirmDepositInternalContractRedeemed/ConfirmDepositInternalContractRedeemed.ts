import {expect} from "chai";
import {dataSourceTest} from "tests/Integration/hooks";
import Deposit, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN, STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN } from "context/Domain/Deposit";
import InternalContract from "context/Domain/InternalContract";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import DepositRepository from "context/Infrastructure/TypeORM/DepositRepository";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import ConfirmDepositInternalContractRedeemed
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemed";
import ConfirmDepositInternalContractRedeemedHandler
    from "context/Application/Command/InternalBlockchain/ConfirmDepositInternalContractRedeemed/ConfirmDepositInternalContractRedeemedHandler";
import {createDeposit} from "tests/Helpers/Deposit";
import {createExternalContract} from "tests/Helpers/ExternalContract";
import { createDepositRequest } from "tests/Helpers/DepositRequest";
import { createOperationRedeem } from "tests/Helpers/InternalBlockchain/OperationRedeem";

describe('ConfirmDepositInternalContractRedeemed', async () => {
    let depositRepository: DepositRepository
    let depositRequestRepository: DepositRequestTypeOrmRepository;
    let internalBlockchain: InternalBlockchain
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let handler: ConfirmDepositInternalContractRedeemedHandler
    let deposit: Deposit

    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    before(async () => {
        depositRepository = new DepositRepository(dataSourceTest)
        depositRequestRepository = new DepositRequestTypeOrmRepository(dataSourceTest)
        internalBlockchain = await InternalBlockchain.init({
            repository: 'stub'
        })
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        handler = new ConfirmDepositInternalContractRedeemedHandler(depositRepository, internalBlockchain)
    })

    describe('success', async () => {
        beforeEach(async () => {
            const depositRequest = createDepositRequest()
            await depositRequestRepository.create(depositRequest)
            deposit = createDeposit({
                depositRequest,
                externalContract: createExternalContract({hashLock})
            })
            deposit.submittedToInternalBlockchain()
            const internalContract = new InternalContract('1.16.1', 'external_contract_id')
            deposit.createdInInternalBlockchain(internalContract)
            await depositRepository.create(deposit)
        })

        it('should not update deposit if it is not redeemed', async () => {
            const command = new ConfirmDepositInternalContractRedeemed(deposit.idString)
            await handler.execute(command)

            const updatedDeposit = await depositRepository.getById(deposit.id.toValue().toString())
            expect(updatedDeposit?.status).equals(STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN)
        })

        it('should update deposit if it is redeemed', async () => {
            const secret = 'b85a0e9f792cb3a9bc7dc75fdb1b795e91cf91ffddacc8d7869638079b02850b'
            internalBlockchainRepository.addRedeemOperation(createOperationRedeem({
                internalContractId: deposit.internalContract?.internalId,
                secret
            }))

            const command = new ConfirmDepositInternalContractRedeemed(deposit.idString)
            await handler.execute(command)

            const updatedDeposit = await depositRepository.getById(deposit.idString)
            expect(updatedDeposit?.status).equals(STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN)
            expect(updatedDeposit?.secret).equals(secret)
        })
    })
});
