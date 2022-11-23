import {Controller, Post, Body, HttpCode, HttpException} from '@nestjs/common';
import SuccessResponse from "../Response/SuccessResponse";
import {SubmitDepositRequest, submitDepositRequestHandler} from "../../Context";

interface CreateDepositDto {
    revpopAccount: string,
    hashLock: string
}

@Controller('deposit')
export default class CreateDepositController {
    @Post("create")
    @HttpCode(200)
    async create(@Body() createDepositDto: CreateDepositDto): Promise<SuccessResponse> {
        const command = new SubmitDepositRequest(
            createDepositDto.revpopAccount,
            createDepositDto.hashLock
        )
        const depositOrError = await submitDepositRequestHandler.execute(command)

        if (depositOrError.isLeft()) {
            throw new HttpException('Error occurred', 500)
        }

        return Promise.resolve(SuccessResponse.create())
    }
}
