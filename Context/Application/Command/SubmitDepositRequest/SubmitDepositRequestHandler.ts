import { UseCase } from "context/Core/Domain/UseCase";
import SubmitDepositRequest from "./SubmitDepositRequest";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import { DatabaseConnectionError } from "context/Infrastructure/Errors";
import DepositRequest from "context/Domain/DepositRequest";
import NativeAccount from "context/Domain/ValueObject/NativeAccount";
import HashLock from "context/Domain/ValueObject/HashLock";
import * as Errors from "./Errors";

export default class SubmitDepositRequestHandler implements UseCase<SubmitDepositRequest, string> {
    constructor(private _repository: DepositRequestRepositoryInterface) {}

    async execute(command: SubmitDepositRequest): Promise<string> {
        const nativeAccount = NativeAccount.create(command.nativeAccount);
        const hashLock = HashLock.create(command.hashLock);

        const exists = await this._repository.load(hashLock);

        if (exists) {
            throw new Errors.DepositRequestAlreadyExists(command.hashLock);
        }

        const depositRequest = DepositRequest.create(nativeAccount, hashLock);

        try {
            await this._repository.create(depositRequest);
        } catch (e: unknown) {
            throw new DatabaseConnectionError();
        }

        return depositRequest.id.toString();
    }
}
