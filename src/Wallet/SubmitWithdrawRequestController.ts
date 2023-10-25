import { Controller, Post, Body, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import SubmitWithdrawRequest from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequest";
import SubmitWithdrawRequestHandler from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequestHandler";

interface Request {
    nativeAccount: string;
    amountToPayInRQETH: number;
    addressOfUserInEthereum: string;
    withdrawalFeeAmount: number;
    withdrawalFeeCurrency: string;
}

@Controller("withdraw")
export default class SubmitWithdrawRequestController {
    constructor(private _submitWithdrawRequestHandler: SubmitWithdrawRequestHandler) {}

    @Post()
    @HttpCode(200)
    async create(@Body() request: Request): Promise<SuccessResponse> {
        const command = new SubmitWithdrawRequest(
            request.nativeAccount,
            request.amountToPayInRQETH,
            request.addressOfUserInEthereum,
            request.withdrawalFeeAmount,
            request.withdrawalFeeCurrency
        );

        try {
            const withdrawRequestId = await this._submitWithdrawRequestHandler.execute(command);

            return Promise.resolve(
                SuccessResponse.create({
                    id: withdrawRequestId,
                })
            );
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
