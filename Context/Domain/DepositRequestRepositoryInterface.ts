import DepositRequest from "./DepositRequest";
import HashLock from "context/Domain/ValueObject/HashLock";

export default interface DepositRequestRepositoryInterface {
    create: (deposit: DepositRequest) => void
    load: (hashLock: HashLock) => Promise<DepositRequest | null>
}
