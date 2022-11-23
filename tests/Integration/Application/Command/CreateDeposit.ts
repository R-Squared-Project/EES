import {expect} from 'chai';
import TypeOrmRepository from "../../../../Context/Infrastructure/TypeORM/TypeOrmRepository";
import CreateDepositHandler from "../../../../Context/Application/Command/CreateDeposit/CreateDepositHandler";
import {CreateDeposit} from "../../../../Context";
import {dataSourceTest} from "../../index";

describe('Create deposit', async () => {
    let repository: TypeOrmRepository

    before(async () => {
        repository = new TypeOrmRepository(dataSourceTest)

        createDepositHandler = new CreateDepositHandler(repository)
    })

    let createDepositHandler: CreateDepositHandler

    it('should create deposit', async () => {
        const revpopAccount = 'revpop_account_name'
        const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

        const command = new CreateDeposit(revpopAccount, hashLock)
        const result = await createDepositHandler.execute(command)
        expect(result.isRight()).true
    })
});
