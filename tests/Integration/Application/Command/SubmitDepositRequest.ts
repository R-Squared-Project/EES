import {expect} from "chai";
import {dataSourceTest} from "../../hooks";
import {SubmitDepositRequest} from "context/index";
import SubmitDepositRequestHandler from "context/Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import DepositRequestTypeOrmRepository from "context/Infrastructure/TypeORM/DepositRequestRepository";
import HashLock from "context/Domain/ValueObject/HashLock";

describe('SubmitDepositRequest', async () => {
    let repository: DepositRequestTypeOrmRepository
    let handler: SubmitDepositRequestHandler

    before(async () => {
        repository = new DepositRequestTypeOrmRepository(dataSourceTest)
        handler = new SubmitDepositRequestHandler(repository)
    })

    describe('success', async () => {
        it('should create deposit', async () => {
            const revpopAccount = 'revpop_account_name'
            const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

            const command = new SubmitDepositRequest(revpopAccount, hashLock)
            await expect(handler.execute(command)).fulfilled

            const deposit = await repository.load(HashLock.create(hashLock))
            expect(deposit).not.null
            expect(deposit?.hashLock.value).equals(hashLock)
        })
    })
});
