import {expect} from 'chai';
import {DataSource} from 'typeorm';
import initWalletDataSourceTest from '../../../Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSourceTest'
import TypeOrmRepositoryWallet from '../../../Context/Wallet/Infrastructure/TypeOrmRepository';
import Deposit from '../../../Context/Wallet/Domain/Deposit';
import {ConfirmDeposit, InitializeDeposit} from '../../../Context/Wallet';
import web3SecretGenerator from '../../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator';
import InitializeDepositHandler
    from '../../../Context/Wallet/Application/Command/InitializeDeposit/InitializeDepositHandler';
import ConfirmDepositHandler from '../../../Context/Wallet/Application/Command/ConfirmDeposit/ConfirmDepositHandler';

describe('Wallet context integration test', async () => {
    let walletDataSourceTest: DataSource
    let walletRepository: TypeOrmRepositoryWallet

    let initializeDepositHandler: InitializeDepositHandler
    let confirmDepositHandler: ConfirmDepositHandler

    before(async () => {
        walletDataSourceTest = await initWalletDataSourceTest()
        walletRepository = new TypeOrmRepositoryWallet(walletDataSourceTest)

        initializeDepositHandler = new InitializeDepositHandler(walletRepository, web3SecretGenerator)
        confirmDepositHandler = new ConfirmDepositHandler(walletRepository)
    })

    after(() => {
        walletDataSourceTest.destroy()
    })

    afterEach(async () => {
        for (const entity of walletDataSourceTest.entityMetadatas) {
            const repository = await walletDataSourceTest.getRepository(entity.name);
            await repository.query(`-- DELETE FROM ${entity.tableName};`);
        }
    })

    it('Initialize -> confirm', async () => {
        const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'
        const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

        // Initialize deposit in web3wallet
        const commandInitializeDeposit = new InitializeDeposit()
        const resultInitializeDeposit = await initializeDepositHandler.execute(commandInitializeDeposit)
        expect(resultInitializeDeposit.isRight(), 'Wallet:InitializeDeposit error').true

        const depositInitialized = resultInitializeDeposit.value.getValue() as Deposit

        //Confirm deposit in web3wallet
        const commandConfirmDeposit = new ConfirmDeposit(
            depositInitialized.sessionId.value,
            txHash,
            'revpop_account',
            hashLock
        )
        const resultConfirmDeposit = await confirmDepositHandler.execute(commandConfirmDeposit)
        expect(resultConfirmDeposit.isRight(), 'Wallet:ConfirmDeposit error').true
    })
});