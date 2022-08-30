import Contract from "./Contract";
import {RedeemUnexpectedError} from "./Errors";

export default interface ContractRepositoryInterface {
    isTxIncluded: (hash: string) => Promise<boolean>
    load: (txHash: string, contractId: string) => Promise<Contract>
    redeem: (contractId: string, secret: string) => Promise<string | RedeemUnexpectedError>
}