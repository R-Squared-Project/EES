import {Controller, Post, Body, HttpCode, HttpException, HttpStatus} from '@nestjs/common';
import {SubmitDepositRequest, submitDepositRequestHandler} from "../../Context";
import SuccessResponse from "../Response/SuccessResponse";

interface Request {
    revpopAccount: string,
    hashLock: string
}

@Controller('deposit')
export default class SubmitDepositRequestController {
    @Post()
    @HttpCode(200)
    async create(@Body() request: Request): Promise<SuccessResponse> {
        const command = new SubmitDepositRequest(
            request.revpopAccount,
            request.hashLock
        )

        try {
            const depositRequestId = await submitDepositRequestHandler.execute(command)

            return Promise.resolve(SuccessResponse.create({
                id: depositRequestId
            }))
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
