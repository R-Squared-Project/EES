import { Controller, Get, HttpCode } from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import config from "context/config";

@Controller("settings")
export default class GetSettingsController {
    @Get("")
    @HttpCode(200)
    async create(): Promise<SuccessResponse> {
        return Promise.resolve(
            SuccessResponse.create({
                contract_address: config.eth.contract_address,
                receiver_address: config.eth.receiver,
                minimum_deposit: config.eth.minimum_deposit_amount.toString(),
                minimum_withdraw: config.eth.minimum_withdraw_amount.toString(),
                minimum_timelock: config.contract.minimum_timelock,
                withdraw_timelock: config.contract.withdrawn_timelock,
                rvp_withdrawal_fee: config.revpop.rvp_withdrawal_fee,
                rveth_withdrawal_fee: config.revpop.rveth_withdrawal_fee,
                revpop_asset_symbol: config.revpop.asset_symbol,
                revpop_ees_account: config.revpop.ees_account,
            })
        );
    }
}
