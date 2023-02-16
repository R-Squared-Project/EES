import Contract from "context/ExternalBlockchain/Contract";
import dayjs from "dayjs";
import {HashZero} from "@ethersproject/constants";

interface ContractParams {
    contractId?: string,
    sender?: string,
    receiver?: string,
    value?: string,
    hashLock?: string,
    timeLock?: number,
    withdrawn?: boolean,
    refunded?: boolean,
    preimage?: string
}

const contractId = 'contract_id'
const sender = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198D'
const receiver = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E'
const value = '10000000000000000'
const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
const timeLock = dayjs().add(10, 'day').unix()
const withdrawn = false
const refunded = false
const preimage = HashZero

export function createContract(params?: ContractParams) {
    return new Contract(
        params?.contractId ?? contractId,
        params?.sender ?? sender,
        params?.receiver ?? receiver,
        params?.value ?? value,
        params?.hashLock ?? hashLock,
        params?.timeLock ?? timeLock,
        params?.withdrawn ?? withdrawn,
        params?.refunded ?? refunded,
        params?.preimage ?? preimage
    )
}
