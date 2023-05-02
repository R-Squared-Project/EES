import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class WithdrawRequestAlreadyExists extends UseCaseError {
    constructor(hashLock: string) {
        super(`The withdraw request with hashLock ${hashLock} already exists.`)
    }
}
