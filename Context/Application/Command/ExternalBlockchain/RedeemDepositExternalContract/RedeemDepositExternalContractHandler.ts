import {UseCase} from "context/Core/Domain/UseCase";
import RedeemDepositExternalContract from "./RedeemDepositExternalContract";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";
import RedeemExecutedInExternalBlockchainValidator from "context/Domain/Validation/RedeemExecutedInExternalBlockchainValidator";
import * as Errors from "context/Application/Command/ExternalBlockchain/RedeemDepositExternalContract/Errors";
import { ensureHasPrefix } from "context/Infrastructure/Helpers";

export default class RedeemDepositExternalContractHandler implements UseCase<RedeemDepositExternalContract, void> {
    constructor(
        private depositRepository: DepositRepositoryInterface,
        private externalBlockchain: ExternalBlockchain
    ) {}

    async execute(command: RedeemDepositExternalContract): Promise<void> {
        const deposit = await this.depositRepository.getById(command.depositId)

        if (null === deposit) {
            throw new Errors.DepositNotExists(command.depositId)
        }

        new RedeemExecutedInExternalBlockchainValidator(deposit).validate()

        const txHash = await this.externalBlockchain.redeem(
            deposit._externalContract.idString,
            ensureHasPrefix(deposit.secret as string)
        )

        await deposit.redeemExecutedInExternalBlockchain(txHash)
        await this.depositRepository.save(deposit)
    }
}
