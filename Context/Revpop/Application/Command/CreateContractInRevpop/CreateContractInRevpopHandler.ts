import Web3 from "web3";
import CreateContractInRevpop from "./CreateContractInRevpop";
import RepositoryInterface from "../../../Domain/RepositoryInterface";
import {Result, Either, right, left} from "../../../../Core";
import {UseCase} from "../../../../Core/Domain/UseCase";
import {UnexpectedError} from "../../../../Core/Logic/AppError";
import {DepositNotFound} from "./Errors";
import {RedeemUnexpectedError} from "../../../Domain/Errors";

type Response = Either<
    UnexpectedError | DepositNotFound | RedeemUnexpectedError,
    Result<void>
    >

export default class CreateContractInRevpopHandler implements UseCase<CreateContractInRevpop, Response> {
    constructor(
        private _repository: RepositoryInterface,
    ) {}

    async execute(command: CreateContractInRevpop): Promise<Response> {
        const deposit = await this._repository.getByTxHash(command.txHash)

        if (deposit === null) {
            return left(new DepositNotFound(command.txHash));
        }

        //Start create contract in revpop
        const revpopContractId = Web3.utils.randomHex(16)
        //End create contract in revpop

        deposit.createInRevpopBlockchain(revpopContractId)

        await this._repository.save(deposit)

        return right(Result.ok<void>());
    }
}