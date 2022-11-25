import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import ExternalContract from "context/Domain/ExternalContract";

const idDefault = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

export function createExternalContract(id?: string) {
    const externalContract = ExternalContract.create(new UniqueEntityID(id ?? idDefault))

    return externalContract
}
