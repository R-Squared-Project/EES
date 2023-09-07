import { Inject, Injectable } from "@nestjs/common";
import * as Errors from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/Errors";
import RepositoryInterface from "context/ExternalBlockchain/Repository/RepositoryInterface";
import NotifierInterface from "context/Notifier/NotifierInterface";
import Setting, { EXTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT } from "context/Setting/Setting";
import dayjs from "dayjs";
import { TransactionReceipt } from "web3-eth";
import * as process from "process";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import ConfirmWithdrawExternalContractRedeemed from "context/Application/Command/ExternalBlockchain/ConfirmWithdrawExternalContractRedeemed/ConfirmWithdrawExternalContractRedeemed";
import Contract from "context/ExternalBlockchain/Contract";
import Withdraw from "context/Domain/Withdraw";

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
            const alertPeriod = parseInt(await this.setting.load(EXTERNAL_REDEEM_ALERT_THRESHOLD_TIMEOUT, "86400"));
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

        const contract = await this.blockchainRepository.loadWithdrawContract(command.txHash, command.contractId);

        this.checkContract(contract, command);

        withdraw.redeem(command.txHash, contract?.preimage);
        this.withdrawRepository.save(withdraw);
    }

    checkContract(contract: Contract | null, command: ConfirmWithdrawExternalContractRedeemed): void {
        if (!contract) {
            throw new Errors.ContractNotFound(command.contractId, command.txHash);
        }
        if (!contract.withdrawn) {
            throw new Errors.ContractWithdrawnIsFalse(contract.contractId);
        }
        if (!contract.preimage) {
            throw new Errors.ContractWithoutPreimage(contract.contractId);
        }
    }
}
