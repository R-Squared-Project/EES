import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import ExternalContract from "context/Domain/ExternalContract";
import dayjs from "dayjs";
import Address from "context/Domain/ValueObject/Address";
import HashLock from "context/Domain/ValueObject/HashLock";
import TimeLock from "context/Domain/ValueObject/TimeLock";

interface Params {
    id?: string,
    timeLock?: number
}

const idDefault = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
const sender = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E'
const receiver = '0x9B1EaAe87cC3A041c4CEf02386109D6aCE4E198E'
const value = '10000000000000000'
const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
const timeLock = dayjs().add(10, 'day').unix()

export function createExternalContract(params?: Params) {
    return new ExternalContract(
        new UniqueEntityID(params?.id ?? idDefault),
        Address.create(sender),
        Address.create(receiver),
        value,
        HashLock.create(hashLock),
        TimeLock.fromUnix(params?.timeLock ?? timeLock)
    )
}
