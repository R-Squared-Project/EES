import { UseCase } from "context/Core/Domain/UseCase";
import Burned from "./Burned";
import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import * as Errors from "./Errors";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export default class BurnedHandler implements UseCase<Burned, void> {
    constructor(
        @Inject("DepositRepositoryInterface") private repository: DepositRepositoryInterface,
        @Inject("InternalBlockchain") private internalBlockchain: InternalBlockchain
    ) {}

    async execute(command: Burned): Promise<void> {
        const deposit = await this.repository.getById(command.depositId);

        if (deposit === null) {
            throw new Errors.DepositNotFound(command.depositId);
        }

        const burnOperations = await this.internalBlockchain.getBurnOperations(
            deposit._depositRequest.nativeAccount.value
        );

        for (const burnOperation of burnOperations) {
            if (!(await this.repository.getByBurnTxHash(burnOperation.txHash))) {
                deposit.refunded(burnOperation.txHash);
                await this.repository.save(deposit);
                console.log(`Deposit ${deposit.idString} assets burned.`);
                break;
            }
        }
    }
}
