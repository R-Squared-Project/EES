import { Controller, Post, Body, HttpCode, HttpException, HttpStatus, Inject } from "@nestjs/common";
import SuccessResponse from "../Response/SuccessResponse";
import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";

interface Request {
    sessionId: string;
}

@Controller("withdraw/get-external-contract-id")
export default class GetWithdrawExternalContractController {
    constructor(@Inject("WithdrawRepositoryInterface") private _repository: WithdrawRepositoryInterface) {}

    @Post()
    @HttpCode(200)
    async check(@Body() request: Request): Promise<SuccessResponse> {
        const withdraw = await this._repository.getByRequestId(request.sessionId);

        if (!withdraw) {
            throw new HttpException("Withdraw not found", HttpStatus.NOT_FOUND);
        }

        if (!withdraw.isReadyToSign()) {
            throw new HttpException("Withdraw status is not Ready-To-Sign", HttpStatus.BAD_REQUEST);
        }

        return Promise.resolve(
            SuccessResponse.create({
                contractId: withdraw.externalContract?.idString,
            })
        );
    }
}
