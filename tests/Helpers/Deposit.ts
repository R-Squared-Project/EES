import Deposit from "context/Domain/Deposit";
import DepositRequest from "context/Domain/DepositRequest";
import ExternalContract from "context/Domain/ExternalContract";
import {createDepositRequest} from "./DepositRequest";
import {createExternalContract} from "./ExternalContract";

interface Params {
    depositRequest?: DepositRequest,
    externalContract?: ExternalContract
}

export function createDeposit(params?: Params) {
    return Deposit.create(
        params?.depositRequest ?? createDepositRequest(),
        params?.externalContract ?? createExternalContract()
    )
}
