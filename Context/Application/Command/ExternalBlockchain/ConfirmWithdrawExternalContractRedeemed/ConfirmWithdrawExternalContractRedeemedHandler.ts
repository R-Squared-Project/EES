import { Inject, Injectable } from "@nestjs/common";
import * as Errors from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/Errors";
import RepositoryInterface from "context/ExternalBlockchain/Repository/RepositoryInterface";
import NotifierInterface from "context/Notifier/NotifierInterface";
import Setting from "context/Setting/Setting";
import dayjs from "dayjs";
import { TransactionReceipt } from "web3-eth";
import * as process from "process";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import ConfirmWithdrawExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemed";

@Injectable()
export default class ConfirmWithdrawExternalContractRedeemedHandler {
    constructor(
        @Inject("WithdrawRepositoryInterface") private readonly withdrawRepository: WithdrawRepositoryInterface,
        @Inject("ExternalBlockchainRepositoryInterface") private readonly blockchainRepository: RepositoryInterface,
        @Inject("NotifierInterface") private readonly notifier: NotifierInterface,
        private readonly setting: Setting
    ) {}

    async execute(command: ConfirmWithdrawExternalContractRedeemed): Promise<void> {
        const withdraw = await this.withdrawRepository.getByExternalContractId(command.contractId);

        if (withdraw === null) {
            throw new Errors.WithdrawNotExists(command.contractId);
        }

        let receipt: TransactionReceipt;

        try {
            receipt = await this.blockchainRepository.getTransactionReceipt(command.txHash);
        } catch (e: unknown) {
            const alertPeriod = parseInt(await this.setting.load("redeem_alert_threshold_timeout", "86400"));
            const alertDate = dayjs().add(alertPeriod, "seconds");

            if (withdraw.externalContract?.timeLock.value.isBefore(alertDate)) {
                await this.notifier.sendMessage("Timeout of HTLC Redeem in Ethereum");
            }

            throw e;
        }

        const blocksDifference = (await this.blockchainRepository.getLastBlockNumber()) - receipt.blockNumber;
        const ethRequiredBlockConfirmations = parseInt(process.env.ETH_REQUIRED_BLOCK_CONFIRMATIONS ?? "10");

        if (blocksDifference <= ethRequiredBlockConfirmations) {
            throw new Errors.ReversibleReceipt(String(receipt.blockNumber));
        }

        withdraw.redeem(command.txHash);
        this.withdrawRepository.save(withdraw);
    }
}
