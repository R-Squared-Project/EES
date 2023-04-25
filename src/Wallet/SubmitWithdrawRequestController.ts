import { Controller, Post, Body, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import SubmitWithdrawRequest from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequest";
import SubmitWithdrawRequestHandler from "context/Application/Command/SubmitWithdrawRequest/SubmitWithdrawRequestHandler";

interface Request {
    revpopAccount: string;
    amountToPayInRVETH: number;
    addressOfUserInEthereum: string;
    hashLock: string;
}

@Controller("withdraw")
export default class SubmitWithdrawRequestController {
    constructor(private _submitWithdrawRequestHandler: SubmitWithdrawRequestHandler) {}

    @Post()
    @HttpCode(200)
    async create(@Body() request: Request): Promise<SuccessResponse> {
        const command = new SubmitWithdrawRequest(
            request.revpopAccount,
            request.amountToPayInRVETH,
            request.addressOfUserInEthereum,
            request.hashLock
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
