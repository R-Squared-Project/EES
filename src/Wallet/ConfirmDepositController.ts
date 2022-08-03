import {Controller, Post, Body, HttpCode, HttpException, NotFoundException} from '@nestjs/common';
import {ConfirmDeposit, confirmDepositHandler} from "../../Context/Wallet";
import SuccessResponse from "../Response/SuccessResponse";
import {DepositNotFoundError} from "../../Context/Wallet/Application/Command/ConfirmDeposit/Errors";

interface ConfirmDepositDto {
    sessionId: string,
    revpopAccount: string,
    txHash: string
}

@Controller('deposit')
export default class ConfirmDepositController {
    @Post("confirm")
    @HttpCode(200)
    async confirm(@Body() confirmDepositDto: ConfirmDepositDto): Promise<SuccessResponse> {
        const command = new ConfirmDeposit(
            confirmDepositDto.sessionId,
            confirmDepositDto.revpopAccount,
            confirmDepositDto.txHash
        )
        const depositOrError = await confirmDepositHandler.execute(command)

        if (depositOrError.isLeft()) {
            if (depositOrError.value.error instanceof DepositNotFoundError) {
                throw new NotFoundException(depositOrError.value.error?.message as string)
            }

            throw new HttpException(depositOrError.value.error?.message as string, 500)
        }

        return Promise.resolve(SuccessResponse.create())
    }
}