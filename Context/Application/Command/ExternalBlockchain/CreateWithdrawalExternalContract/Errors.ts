import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class WithdrawNotExists extends UseCaseError {
    constructor(id: string) {
        super(`The withdraw with id "${id}" not exists.`);
    }
}
