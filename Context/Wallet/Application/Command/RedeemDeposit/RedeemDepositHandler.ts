import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, left, right} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import RedeemDeposit from "./RedeemDeposit";
import {DepositNotFoundError} from "./Errors";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositAlreadyRedeemed} from "../../../Domain/Errors";

type Response = Either<
    UnexpectedError |
    DepositNotFoundError |
    DepositAlreadyRedeemed,
    Result<void>
>

export default class RedeemDepositHandler implements UseCase<RedeemDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface
    ) {}

    async execute(command: RedeemDeposit): Promise<Response> {
        // const deposit = await this._repository.getBySessionId(command.sessionId)

        // if (!deposit) {
        //     return left(new DepositNotFoundError(command.sessionId)) as Response;
        // }

        // await this._repository.save(deposit)

        return right(Result.ok<void>()) as Response;
    }
}