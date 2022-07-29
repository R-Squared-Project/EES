import web3SecretGenerator from "./Infrastructure/SecretGenerator/Web3SecretGenerator";
import StubRepository from "./Infrastructure/StubRepository";
import InitializeDeposit from "./Application/Command/InitializeDeposit/InitializeDeposit";
import InitializeDepositHandler from "./Application/Command/InitializeDeposit/InitializeDepositHandler";

const stubRepository = new StubRepository()
const initializeDepositHandler = new InitializeDepositHandler(stubRepository, web3SecretGenerator)

export {InitializeDeposit, initializeDepositHandler}