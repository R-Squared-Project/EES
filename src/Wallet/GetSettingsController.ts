import {Controller, Get, HttpCode} from '@nestjs/common';
import SuccessResponse from "../Response/SuccessResponse";
import config from "context/config";

@Controller('deposit')
export default class GetSettingsController {
    @Get("settings")
    @HttpCode(200)
    async create(): Promise<SuccessResponse> {
        return Promise.resolve(SuccessResponse.create({
            contract_address: config.eth.contract_address,
            receiver_address: config.eth.receiver,
            minimum_deposit: config.eth.minimum_deposit_amount.toString(),
            minimum_timelock: config.contract.minimum_timelock
        }))
    }
}
