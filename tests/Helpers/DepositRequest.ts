import DepositRequest from "context/Domain/DepositRequest";
import NativeAccount from "context/Domain/ValueObject/NativeAccount";
import HashLock from "context/Domain/ValueObject/HashLock";

const internalAccountDefault = "native_account_name";
const hashLockDefault = "0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c";

export function createDepositRequest(internalAccount?: string, hashLock?: string) {
    return DepositRequest.create(
        NativeAccount.create(internalAccount ?? internalAccountDefault),
        HashLock.create(hashLock ?? hashLockDefault)
    );
}
