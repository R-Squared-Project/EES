import {expect} from 'chai';
import StubRepository from "../../../../../Context/Infrastructure/TypeORM/StubRepository";
import CreateDepositHandler from "../../../../../Context/Application/Command/CreateDeposit/CreateDepositHandler";
import {CreateDeposit} from "../../../../../Context";

describe('CreateDepositHandler', () => {
    let repository: StubRepository;
    let handler: CreateDepositHandler;

    const internalAccount = 'revpop_account_name'
    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    beforeEach(function() {
        repository = new StubRepository()
        handler = new CreateDepositHandler(repository);
    });

    describe('execute', () => {
        describe('success', () => {
            it('should save new deposit', async () => {
                const command = new CreateDeposit(internalAccount, hashLock)
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(1)
                expect(depositOrError.isRight()).true
            });
        })

        describe('error', () => {
            it('should return error if account is empty', async () => {
                const command = new CreateDeposit('', hashLock)
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });

            it('should return error if hashLock is empty', async () => {
                const command = new CreateDeposit(internalAccount, '')
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });

            it('should return error if hashLock is invalid', async () => {
                const command = new CreateDeposit(internalAccount, 'invalid_hashLock')
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });
        })
    });
});
