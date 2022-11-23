import DepositRequest from "./DepositRequest";

export default interface DepositRequestRepositoryInterface {
    create: (deposit: DepositRequest) => void
}
