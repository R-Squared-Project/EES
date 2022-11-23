import {expect} from 'chai';
import TypeOrmRepository from "../../../../Context/Infrastructure/TypeORM/TypeOrmRepository";
import {SubmitDepositRequest} from "../../../../Context";
import {dataSourceTest} from "../../index";
import SubmitDepositRequestHandler
    from "../../../../Context/Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import DepositRequestTypeOrmRepository
    from "../../../../Context/Infrastructure/TypeORM/DepositRequestTypeOrmRepository";

describe('Create deposit', async () => {
    let repository: DepositRequestTypeOrmRepository
    let createDepositHandler: SubmitDepositRequestHandler

    before(async () => {
        repository = new DepositRequestTypeOrmRepository(dataSourceTest)

        createDepositHandler = new SubmitDepositRequestHandler(repository)
    })

    it('should create deposit', async () => {
        const revpopAccount = 'revpop_account_name'
        const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

        const command = new SubmitDepositRequest(revpopAccount, hashLock)
        const result = await createDepositHandler.execute(command)
        expect(result.isRight()).true
    })
});
