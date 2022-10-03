import {expect} from 'chai';
import {DataSource} from 'typeorm';
import initDataSourceTest from '../../../Context/Revpop/Infrastructure/TypeORM/DataSource/DataSourceTest'
import TypeOrmRepository from '../../../Context/Revpop/Infrastructure/TypeOrmRepository';
import {
    ConfirmDepositByUser,
    ConfirmDepositByBlockchain,
    CreateContractInRevpop,
    RedeemDeposit
} from '../../../Context/Revpop';
import ConfirmDepositByBlockchainHandler
    from '../../../Context/Revpop/Application/Command/ConfirmDepositByBlockchain/ConfirmDepositByBlockchainHandler';
import ConfirmDepositByUserHandler
    from '../../../Context/Revpop/Application/Command/ConfirmDepositByUser/ConfirmDepositByUserHandler';
import CreateContractInRevpopHandler
    from "../../../Context/Revpop/Application/Command/CreateContractInRevpop/CreateContractInRevpopHandler";
import RedeemDepositHandler from '../../../Context/Revpop/Application/Command/RedeemDeposit/RedeemDepositHandler';
import '../../../Context/Revpop/Subscribers'

describe('Revpop context integration test', async () => {
    let dataSourceTest: DataSource
    let repository: TypeOrmRepository

    let confirmDepositByBlockchainHandler: ConfirmDepositByBlockchainHandler
    let confirmDepositByUserHandler: ConfirmDepositByUserHandler
    let createContractInRevpop: CreateContractInRevpopHandler
    let redeemDepositHandler: RedeemDepositHandler

    before(async () => {
        dataSourceTest = await initDataSourceTest()
        repository = new TypeOrmRepository(dataSourceTest)
        confirmDepositByUserHandler = new ConfirmDepositByUserHandler(repository)
        confirmDepositByBlockchainHandler = new ConfirmDepositByBlockchainHandler(repository)
        createContractInRevpop = new CreateContractInRevpopHandler(repository)
        redeemDepositHandler = new RedeemDepositHandler(repository)
    })

    after(() => {
        dataSourceTest.destroy()
    })

    afterEach(async () => {
        for (const entity of dataSourceTest.entityMetadatas) {
            const repository = await dataSourceTest.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName};`);
        }
    })

    it('Confirm deposit by user -> Confirm deposit by blockchain -> Create contract in Revpop -> redeem', async () => {
        const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'
        const revpopAccount = 'revpop_account'
        const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

        // Confirm deposit by user
        const commandConfirmDepositByUser = new ConfirmDepositByUser(txHash, revpopAccount, hashLock)
        const resultConfirmDepositByUser = await confirmDepositByUserHandler.execute(commandConfirmDepositByUser)
        expect(resultConfirmDepositByUser.isRight(), 'Revpop:ConfirmDepositByUser error').true

        // Confirm deposit by blockchain
        const commandConfirmDepositByBlockchain = new ConfirmDepositByBlockchain(txHash, '1000', hashLock)
        const resultConfirmDepositByBlockchain = await confirmDepositByBlockchainHandler.execute(commandConfirmDepositByBlockchain)
        expect(resultConfirmDepositByUser.isRight(), 'Revpop:ConfirmDepositByBlockchain error').true

        // Create contract in revpop.
        // TODO::createContractInRevpop is async operation. Is it possible make it sync in tests?
        const commandCreateContractInRevpop = new CreateContractInRevpop(txHash)
        const resultCreateContractInRevpop = await createContractInRevpop.execute(commandCreateContractInRevpop)
        expect(resultConfirmDepositByUser.isRight(), 'Revpop:ConfirmDepositByBlockchain error').true

        const deposit = await repository.getByTxHash(txHash)

        if (deposit === null) {
            throw new Error('Deposit is null')
        }

        //Redeem deposit
        const commandRedeemDeposit = new RedeemDeposit(deposit.revpopContractId as string)
        const resultRedeemDeposit = await redeemDepositHandler.execute(commandRedeemDeposit)
        expect(resultRedeemDeposit.isRight(), resultRedeemDeposit.value.error?.message).true
    })
});