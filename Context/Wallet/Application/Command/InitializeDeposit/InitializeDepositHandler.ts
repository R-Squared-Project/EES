import Web3 from "web3";
import InitializeDeposit from "./InitializeDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import SecretGeneratorInterface from "../../../Infrastructure/SecretGenerator/SecretGeneratorInterface";
import Deposit from "../../../Domain/Deposit";
import {Result, Either, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";

type Response = Either<
    UnexpectedError,
    Result<Deposit>
>

export default class InitializeDepositHandler implements UseCase<InitializeDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
        private _secretGenerator: SecretGeneratorInterface
    ) {}

    execute(request: InitializeDeposit): Response {
        const secret = Web3.utils.randomHex(16)
        const deposit = new Deposit(secret)

        this._repository.create(deposit);

        return right(Result.ok<Deposit>(deposit)) as Response;
    }
}