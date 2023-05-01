import Withdraw from "./Withdraw";

export default interface WithdrawRepositoryInterface {
    save: (withdraw: Withdraw) => void;
    getAllForCheck: () => Promise<Withdraw[]>;
}
