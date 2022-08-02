import ConfirmDeposit from "./ConfirmDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, left, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {DepositNotFoundError} from "./Errors";
import {UnexpectedError} from "../../../../Core/Logic/AppError";

type Response = Either<
    UnexpectedError |
    DepositNotFoundError,
    Result<void>
>

export default class ConfirmDepositHandler implements UseCase<ConfirmDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface
    ) {}

    execute(command: ConfirmDeposit): Response {
        const deposit = this._repository.getBySecret(command.secret)
        
        if (!deposit) {
            return left(new DepositNotFoundError(command.secret)) as Response;
        }
        
        deposit.confirm(command.account)
        this._repository.save(deposit)

        return right(Result.ok<void>()) as Response;
    }
}