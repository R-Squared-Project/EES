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
                deposit_contract_address: config.eth.deposit_contract_address,
                withdraw_contract_address: config.eth.withdraw_contract_address,
                receiver_address: config.eth.receiver,
                minimum_deposit: config.eth.minimum_deposit_amount.toString(),
                minimum_withdraw: config.eth.minimum_withdraw_amount.toString(),
                minimum_timelock: config.contract.minimum_timelock,
                withdraw_timelock: config.contract.withdraw_internal_timelock,
                native_token_withdrawal_fee: config.r_squared.native_token_withdrawal_fee,
                rqeth_withdrawal_fee: config.r_squared.rqeth_withdrawal_fee,
                internal_asset_symbol: config.r_squared.asset_symbol,
                internal_ees_account: config.r_squared.ees_account,
            })
        );
    }
}
