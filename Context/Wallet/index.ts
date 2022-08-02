import web3SecretGenerator from "./Infrastructure/SecretGenerator/Web3SecretGenerator";
import InitializeDeposit from "./Application/Command/InitializeDeposit/InitializeDeposit";
import InitializeDepositHandler from "./Application/Command/InitializeDeposit/InitializeDepositHandler";
import ConfirmDeposit from "./Application/Command/ConfirmDeposit/ConfirmDeposit";
import ConfirmDepositHandler from "./Application/Command/ConfirmDeposit/ConfirmDepositHandler";
import TypeOrmRepository from "./Infrastructure/TypeOrmRepository";
import WalletDataSource from "./Infrastructure/TypeORM/DataSource/WalletDataSource";

const repository = new TypeOrmRepository(WalletDataSource)
const initializeDepositHandler = new InitializeDepositHandler(repository, web3SecretGenerator)
const confirmDepositHandler = new ConfirmDepositHandler(repository)

export {InitializeDeposit, initializeDepositHandler}
export {ConfirmDeposit, confirmDepositHandler}