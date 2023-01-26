import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositRequestAlreadyExists extends UseCaseError {
    constructor(hashLock: string) {
        super(`The deposit request with hashLock ${hashLock} already exists.`)
    }
}
