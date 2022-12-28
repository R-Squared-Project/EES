import Contract from "context/InternalBlockchain/Contract";

const id = '1.16.1'
const externalId = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

interface Params {
    id?: string,
    externalId?: string
}

export function createContract(params?: Params) {
    return new Contract(
        params?.id ?? id,
        params?.externalId ?? externalId
    )
}
