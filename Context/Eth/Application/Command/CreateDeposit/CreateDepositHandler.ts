import {Either, Result, right} from "../../../../Core";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {UseCase} from "../../../../Core/Domain/UseCase";
import CreateDeposit from "./CreateDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import Deposit from "../../../Domain/Deposit";

type Response = Either<
    UnexpectedError,
    Result<Deposit>
>

export default class CreateDepositHandler implements UseCase<CreateDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    execute(command: CreateDeposit): Response {
        return right(Result.ok<void>()) as Response;
    }
}