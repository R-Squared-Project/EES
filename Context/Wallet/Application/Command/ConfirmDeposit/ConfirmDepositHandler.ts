import ConfirmDeposit from "./ConfirmDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, left, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {DepositNotFoundError} from "./Errors";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositAlreadyConfirmed} from "../../../Domain/Errors";

type Response = Either<
    UnexpectedError |
    DepositNotFoundError |
    DepositAlreadyConfirmed,
    Result<void>
>

export default class ConfirmDepositHandler implements UseCase<ConfirmDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface
    ) {}

    async execute(command: ConfirmDeposit): Promise<Response> {
        const deposit = await this._repository.getBySessionId(command.sessionId)

        if (!deposit) {
            return left(new DepositNotFoundError(command.sessionId)) as Response;
        }
        
        const result = deposit.confirm(command.revpopAccount, command.txHash)

        if (result.isLeft()) {
            return result as Response
        }

        this._repository.save(deposit)

        return right(Result.ok<void>()) as Response;
    }
}