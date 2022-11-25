import Deposit from "context/Domain/Deposit";
import DepositRequest from "context/Domain/DepositRequest";
import ExternalContract from "context/Domain/ExternalContract";
import {createDepositRequest} from "./DepositRequest";
import {createExternalContract} from "./ExternalContract";

export function createDeposit(depositRequest?: DepositRequest, externalContract?: ExternalContract) {
    const deposit = Deposit.create(
        depositRequest ?? createDepositRequest(),
        externalContract ?? createExternalContract()
    )

    return deposit
}
