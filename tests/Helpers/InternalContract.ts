import InternalContract from "context/Domain/InternalContract";

const internalContractId  = '1.16.1'

interface Params {
    iternalContractId?: string
}

export function createInternalContract(params?: Params) {
    return new InternalContract(
        params?.iternalContractId ?? internalContractId
    )
}
