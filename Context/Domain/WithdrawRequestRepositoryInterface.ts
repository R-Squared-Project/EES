import HashLock from "context/Domain/ValueObject/HashLock";
import WithdrawRequest from "context/Domain/WithdrawRequest";

export default interface WithdrawRequestRepositoryInterface {
    create: (withdrawRequest: WithdrawRequest) => void
    load: (hashLock: HashLock) => Promise<WithdrawRequest | null>
}
