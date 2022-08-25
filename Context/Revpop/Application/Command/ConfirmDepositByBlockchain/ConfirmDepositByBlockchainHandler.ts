import ConfirmDepositByBlockchain from "./ConfirmDepositByBlockchain";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositNotFound} from "./Errors";
import Deposit from "../../../Domain/Deposit";
import TxHash from "../../../Domain/TxHash";

type Response = Either<
    UnexpectedError |
    DepositNotFound,
    Result<void>
>

export default class ConfirmDepositByBlockchainHandler implements UseCase<ConfirmDepositByBlockchain, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: ConfirmDepositByBlockchain): Promise<Response> {
        const deposit = await this._repository.getByTxHash(command.txHash)

        if (deposit === null) {
            const txHashOrError = TxHash.create(command.txHash)

            if (txHashOrError.isFailure) {
                return left(Result.fail<void>(txHashOrError.error)) as Response;
            }

            const deposit = Deposit.createByBlockchain(
                txHashOrError.getValue() as TxHash,
                command.value,
                command.hashLock
            )
            await this._repository.create(deposit)

            return right(Result.ok<void>());
        }

        deposit.confirmByBlockchain()

        await this._repository.save(deposit)

        return right(Result.ok<void>());
    }
}