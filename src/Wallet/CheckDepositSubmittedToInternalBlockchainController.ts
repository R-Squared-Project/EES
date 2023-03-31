import {Controller, Post, Body, HttpCode, HttpException, HttpStatus} from '@nestjs/common';
import {
    CheckDepositSubmittedToInternalBlockchainRequest,
    checkDepositSubmittedToInternalBlockchainRequestHandler,
} from "../../Context";
import SuccessResponse from "../Response/SuccessResponse";

interface Request {
    sessionId: string
}

@Controller('deposit/submitted')
export default class CheckDepositSubmittedToInternalBlockchainController {
    @Post()
    @HttpCode(200)
    async create(@Body() request: Request): Promise<SuccessResponse> {
        const command = new CheckDepositSubmittedToInternalBlockchainRequest(
            request.sessionId,
        )

        try {
            const depositRequestId = await checkDepositSubmittedToInternalBlockchainRequestHandler.execute(command)

            return Promise.resolve(SuccessResponse.create({
                id: depositRequestId
            }))
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
