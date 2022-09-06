import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import ConfirmDepositByUser from "./ConfirmDepositByUser";
import Deposit from "../../../Domain/Deposit";
import TxHash from "../../../Domain/TxHash";
import RevpopAccount from "../../../Domain/RevpopAccount";
import HashLock from "../../../../Wallet/Domain/HashLock";
import {DepositAlreadyExists} from "./Errors";

type Response = Either<
    UnexpectedError |
    DepositAlreadyExists,
    Result<Deposit>
>

export default class ConfirmDepositByUserHandler implements UseCase<ConfirmDepositByUser, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: ConfirmDepositByUser): Promise<Response> {
        const deposit = await this._repository.getByTxHash(command.txHash)

        const txHashOrError = TxHash.create(command.txHash)
        const revpopAccountOrError = RevpopAccount.create(command.revpopAccount)
        const hashLockOrError = HashLock.create(command.hashLock)

        const combinedPropsResult = Result.combine([txHashOrError, revpopAccountOrError, hashLockOrError]);

        if (combinedPropsResult.isFailure) {
            return left(Result.fail<void>(combinedPropsResult.error)) as Response;
        }

        if (deposit === null) {
            const deposit = Deposit.createByUser(
                txHashOrError.getValue() as TxHash,
                revpopAccountOrError.getValue() as RevpopAccount,
                hashLockOrError.getValue() as HashLock,
            )

            await this._repository.create(deposit);

            return right(Result.ok<Deposit>(deposit)) as Response;
        }

        deposit.confirmByUser(revpopAccountOrError.getValue() as RevpopAccount)

        await this._repository.save(deposit);

        return right(Result.ok<Deposit>(deposit)) as Response;
    }
}