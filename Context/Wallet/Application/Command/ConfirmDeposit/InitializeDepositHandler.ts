import Web3 from "web3";
import ConfirmDeposit from "./ConfirmDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import Deposit from "../../../Domain/Deposit";

export default class ConfirmDepositHandler {
    constructor(
        private _repository: RepositoryInterface
    ) {}

    execute(command: ConfirmDeposit) {
        const deposit = this._repository.getBySecret(command.secret)
        deposit.confirm(command.account)
        this._repository.save(deposit)
    }
}