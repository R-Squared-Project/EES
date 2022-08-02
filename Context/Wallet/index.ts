import web3SecretGenerator from "./Infrastructure/SecretGenerator/Web3SecretGenerator";
import StubRepository from "./Infrastructure/StubRepository";
import InitializeDeposit from "./Application/Command/InitializeDeposit/InitializeDeposit";
import InitializeDepositHandler from "./Application/Command/InitializeDeposit/InitializeDepositHandler";
import ConfirmDeposit from "./Application/Command/ConfirmDeposit/ConfirmDeposit";
import ConfirmDepositHandler from "./Application/Command/ConfirmDeposit/ConfirmDepositHandler";

const stubRepository = new StubRepository()
const initializeDepositHandler = new InitializeDepositHandler(stubRepository, web3SecretGenerator)
const confirmDepositHandler = new ConfirmDepositHandler(stubRepository)

export {InitializeDeposit, initializeDepositHandler}
export {ConfirmDeposit, confirmDepositHandler}