import {expect} from 'chai';
import DepositRequestStubRepository from "context/Infrastructure/TypeORM/DepositRequestStubRepository";
import SubmitDepositRequestHandler from "context/Application/Command/SubmitDepositRequest/SubmitDepositRequestHandler";
import {SubmitDepositRequest} from "context/index";
import {HashLockValidationError, RevpopAccountValidationError} from "context/Domain/Errors";

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

                await expect(handler.execute(command)).fulfilled
                expect(repository).repositorySize(1)
            });
        })

        describe('error', () => {
            it('should return error if account is empty', async () => {
                const command = new SubmitDepositRequest('', hashLock)

                expect(repository).repositoryEmpty
                await expect(handler.execute(command)).rejectedWith(RevpopAccountValidationError)
            });

            it('should return error if hashLock is empty', async () => {
                const command = new SubmitDepositRequest(internalAccount, '')

                expect(repository).repositoryEmpty
                await expect(handler.execute(command)).rejectedWith(HashLockValidationError, 'HashLock can not be empty')
            });

            it('should return error if hashLock is invalid', async () => {
                const command = new SubmitDepositRequest(internalAccount, 'invalid_hashLock')

                expect(repository).repositoryEmpty
                await expect(handler.execute(command)).rejectedWith(HashLockValidationError, 'HashLock "invalid_hashLock" is invalid: HashLock format is invalid')
            });
        })
    });
});
