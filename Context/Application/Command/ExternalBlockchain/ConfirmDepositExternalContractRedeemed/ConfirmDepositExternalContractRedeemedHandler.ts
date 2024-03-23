import ConfirmDepositExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/ConfirmDepositExternalContractRedeemed";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import { Inject, Injectable } from "@nestjs/common";
import * as Errors from "context/Application/Command/ExternalBlockchain/ConfirmDepositExternalContractRedeemed/Errors";
import RepositoryInterface from "context/ExternalBlockchain/Repository/RepositoryInterface";
import NotifierInterface from "context/Notifier/NotifierInterface";
import Setting, { EXTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT } from "context/Setting/Setting";
import dayjs from "dayjs";
import { TransactionReceipt } from "web3-eth";
import * as process from "process";

@Injectable()
export default class ConfirmDepositExternalContractRedeemedHandler {
    constructor(
        @Inject("DepositRepositoryInterface") private readonly depositRepository: DepositRepositoryInterface,
        @Inject("ExternalBlockchainRepositoryInterface") private readonly blockchainRepository: RepositoryInterface,
        @Inject("NotifierInterface") private readonly notifier: NotifierInterface,
        private readonly setting: Setting
    ) {}

    async execute(command: ConfirmDepositExternalContractRedeemed): Promise<void> {
        const deposit = await this.depositRepository.getByRedeemTxHash(command.txHash);

        if (deposit === null) {
            throw new Errors.DepositNotExists(command.txHash);
        }

        let receipt: TransactionReceipt;

        try {
            receipt = await this.blockchainRepository.getTransactionReceipt(command.txHash);
        } catch (e: unknown) {
            const alertPeriod = parseInt(await this.setting.load(EXTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT, "86400"));
            const alertDate = dayjs().add(alertPeriod, "seconds");

            if (deposit._externalContract.timeLock.value.isBefore(alertDate)) {
                await this.notifier.sendMessage("Timeout of HTLC Redeem in Ethereum");
            }

            throw e;
        }

        if (receipt === null) {
            throw new Errors.TransactionReceiptNotFound(command.txHash);
        }

        const blocksDifference = (await this.blockchainRepository.getLastBlockNumber()) - receipt.blockNumber;
        const ethRequiredBlockConfirmations = parseInt(process.env.ETH_REQUIRED_BLOCK_CONFIRMATIONS ?? "10");

        if (blocksDifference <= ethRequiredBlockConfirmations) {
            throw new Errors.ReversibleReceipt(String(receipt.blockNumber));
        }

        deposit.completed();
        this.depositRepository.save(deposit);
    }
}
