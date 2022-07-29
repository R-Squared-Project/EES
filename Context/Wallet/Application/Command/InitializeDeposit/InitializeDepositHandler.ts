import Web3 from "web3";
import InitializeDeposit from "./InitializeDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import SecretGeneratorInterface from "../../../Infrastructure/SecretGenerator/SecretGeneratorInterface";
import Deposit from "../../../Domain/Deposit";

export default class InitializeDepositHandler {
    constructor(
        private _repository: RepositoryInterface,
        private _secretGenerator: SecretGeneratorInterface
    ) {}

    execute(command: InitializeDeposit) {
        const secret = Web3.utils.randomHex(16)
        const deposit = new Deposit(secret)

        this._repository.create(deposit);

        return deposit.secret
    }
}