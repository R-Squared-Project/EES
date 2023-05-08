import WithdrawRequest from "context/Domain/WithdrawRequest";

export default interface WithdrawRequestRepositoryInterface {
    create: (withdrawRequest: WithdrawRequest) => void;
    findAllCreated: () => Promise<WithdrawRequest[]>;
    save: (withdrawRequest: WithdrawRequest) => void;
}
