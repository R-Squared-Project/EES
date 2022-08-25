import {Result} from "../../Core";
import {DomainError} from "../../Core/Domain/DomainError";

export class RedeemUnexpectedError extends Result<DomainError>{
    constructor(revpopContractId: string) {
        super(false, {
            message: `Deposit ${revpopContractId} can't be redeemed.`
        } as DomainError)
    }
}

export class DepositNotConfirmed extends Result<DomainError>{
    constructor(revpopContractId: string) {
        super(false, {
            message: `Deposit ${revpopContractId} can't be redeemed. It is not confirmed yet.`
        } as DomainError)
    }
}

export class DepositNotCreatedInRevpop extends Result<DomainError>{
    constructor(revpopContractId: string) {
        super(false, {
            message: `Deposit ${revpopContractId} can't be redeemed. HTLC contract is created in revpop blockchain.`
        } as DomainError)
    }
}

export class DepositAlreadyRedeemed extends Result<DomainError>{
    constructor(revpopContractId: string) {
        super(false, {
            message: `Deposit ${revpopContractId} already redeemed.`
        } as DomainError)
    }
}