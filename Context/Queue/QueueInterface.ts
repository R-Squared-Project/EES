export const EXTERNAL_DEPOSIT_CONTRACT_REDEEM = "external_deposit_contract_redeem";
export const EXTERNAL_WITHDRAW_CONTRACT_REDEEM = "external_withdraw_contract_redeem";
export const WITHDRAW_READY_TO_PROCESS = "withdraw_ready_to_process";

export default interface QueueInterface {
    publish: (key: string, message: any) => Promise<void>;
    consume: <T>(queueName: string, onMessage: (msg: T, ack: () => void, nack: () => void) => void) => Promise<void>;
    initProduce: () => Promise<void>;
}
