import InternalContract from "context/Domain/InternalContract";

const internalContractId = '1.16.1'
const externalContractId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

interface Params {
    iternalContractId?: string,
    externalContractId?: string
}

export function createInternalContract(params?: Params) {
    return new InternalContract(
        params?.iternalContractId ?? internalContractId,
        params?.externalContractId ?? externalContractId
    )
}
