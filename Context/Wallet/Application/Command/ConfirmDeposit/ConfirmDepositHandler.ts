import ConfirmDeposit from "./ConfirmDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, left, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {DepositNotFoundError} from "./Errors";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositAlreadyConfirmed} from "../../../Domain/Errors";
import RevpopAccount from "../../../Domain/RevpopAccount";
import TxHash from "../../../Domain/TxHash";

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

        const txHashOrError = TxHash.create(command.txHash)
        const revpopAccountOrError = RevpopAccount.create(command.revpopAccount)

        const combinedPropsResult = Result.combine([ txHashOrError, revpopAccountOrError ]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const result = deposit.confirm(
            txHashOrError.getValue() as TxHash,
            revpopAccountOrError.getValue() as RevpopAccount,
            command.hashLock
        )

        if (result.isLeft()) {
            return result as Response
        }

        await this._repository.save(deposit)

        return right(Result.ok<void>()) as Response;
    }
}