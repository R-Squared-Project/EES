import {Either, left, Result, right} from "../../../../Core";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {UseCase} from "../../../../Core/Domain/UseCase";
import CreateDeposit from "./CreateDeposit";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import Deposit from "../../../Domain/Deposit";
import TxHash from "../../../Domain/TxHash";
import Address from "../../../Domain/Address";

type Response = Either<
    UnexpectedError,
    Result<Deposit>
>

export default class CreateDepositHandler implements UseCase<CreateDeposit, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    execute(command: CreateDeposit): Response {
        const txHashOrError = TxHash.create(command.txHash)
        const senderOrError = Address.create(command.sender)
        const receiverOrError = Address.create(command.receiver)

        const combinedPropsResult = Result.combine([txHashOrError, senderOrError, receiverOrError]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        const deposit = new Deposit(
            txHashOrError.getValue() as TxHash,
            command.contractId,
            senderOrError.getValue() as Address,
            receiverOrError.getValue() as Address,
            command.value,
            command.hashLock,
            command.timelock
        )

        this._repository.create(deposit)

        return right(Result.ok<Deposit>(deposit)) as Response;
    }
}