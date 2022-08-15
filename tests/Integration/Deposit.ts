import {expect} from 'chai';
import initWalletDataSourceTest from '../../Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSourceTest'
import TypeOrmRepositoryWallet from '../../Context/Wallet/Infrastructure/TypeOrmRepository';
import web3SecretGenerator from '../../Context/Wallet/Infrastructure/SecretGenerator/Web3SecretGenerator';
import InitializeDepositHandler
    from '../../Context/Wallet/Application/Command/InitializeDeposit/InitializeDepositHandler';
import {ConfirmDeposit, InitializeDeposit} from '../../Context/Wallet';
import ConfirmDepositHandler from '../../Context/Wallet/Application/Command/ConfirmDeposit/ConfirmDepositHandler';
import {DataSource} from 'typeorm';
import Deposit from '../../Context/Wallet/Domain/Deposit';

describe('Deposit', async () => {
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

        // Initialize deposit in web3wallet
        const commandInitializeDeposit = new InitializeDeposit()
        const resultInitializeDeposit = await initializeDepositHandler.execute(commandInitializeDeposit)
        expect(resultInitializeDeposit.isRight(), 'Wallet:InitializeDeposit error').true

        const depositInitialized = resultInitializeDeposit.value.getValue() as Deposit

        //Confirm deposit in web3wallet
        const commandConfirmDeposit = new ConfirmDeposit(
            depositInitialized.sessionId.value,
            'revpop_account',
            txHash
        )
        const resultConfirmDeposit = await confirmDepositHandler.execute(commandConfirmDeposit)
        expect(resultConfirmDeposit.isRight(), 'Wallet:ConfirmDeposit error').true
    })
});