import {Controller, Get, HttpException} from '@nestjs/common';
import {InitializeDeposit, initializeDepositHandler} from "../../Context/Wallet";
import SuccessResponse from "../Response/SuccessResponse";

@Controller('deposit')
export default class InitializeDepositController {
    @Get("initialize")
    async initialize(): Promise<SuccessResponse> {
        const command = new InitializeDeposit()
        const depositOrError = initializeDepositHandler.execute(command)

        if (depositOrError.isLeft()) {
            throw new HttpException(depositOrError.value.error?.message as string, 500)
        }

        return Promise.resolve(SuccessResponse.create({
            sessionId: depositOrError.value.getValue()?.sessionId
        }))
    }
}