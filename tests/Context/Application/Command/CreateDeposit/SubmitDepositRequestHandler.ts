import {expect} from 'chai';
import DepositRequestStubRepository from "../../../../../Context/Infrastructure/TypeORM/DepositRequestStubRepository";
import SubmitDepositRequestHandler from "../../../../../Context/Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import {SubmitDepositRequest} from "../../../../../Context";

describe('SubmitDepositRequestHandler', () => {
    let repository: DepositRequestStubRepository;
    let handler: SubmitDepositRequestHandler;

    const internalAccount = 'revpop_account_name'
    const hashLock = '0x14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'

    beforeEach(function() {
        repository = new DepositRequestStubRepository()
        handler = new SubmitDepositRequestHandler(repository);
    });

    describe('execute', () => {
        describe('success', () => {
            it('should save new deposit', async () => {
                const command = new SubmitDepositRequest(internalAccount, hashLock)
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(1)
                expect(depositOrError.isRight()).true
            });
        })

        describe('error', () => {
            it('should return error if account is empty', async () => {
                const command = new SubmitDepositRequest('', hashLock)
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });

            it('should return error if hashLock is empty', async () => {
                const command = new SubmitDepositRequest(internalAccount, '')
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });

            it('should return error if hashLock is invalid', async () => {
                const command = new SubmitDepositRequest(internalAccount, 'invalid_hashLock')
                const depositOrError = await handler.execute(command)

                expect(repository.size).equals(0)
                expect(depositOrError.isLeft()).true
            });
        })
    });
});
