import {expect} from 'chai';
import StubRepository from '../../../../../../Context/Revpop/Infrastructure/StubRepository';
import Deposit from "../../../../../../Context/Revpop/Domain/Deposit";
import TxHash from "../../../../../../Context/Revpop/Domain/TxHash";
import RevpopAccount from "../../../../../../Context/Revpop/Domain/RevpopAccount";
import {CreateContractInRevpop} from "../../../../../../Context/Revpop";
import CreateContractInRevpopHandler
    from "../../../../../../Context/Revpop/Application/Command/CreateContractInRevpop/CreateContractInRevpopHandler";
import {DepositNotFound} from "../../../../../../Context/Revpop/Application/Command/CreateContractInRevpop/Errors";

describe('Revpop::CreateContractInRevpop', () => {
    let repository: StubRepository;
    let handler: CreateContractInRevpopHandler;
    const txHash = '0x2592cf699903e83bfd664aa4e339388fd044fe31643a85037be803a5d162729f'

    beforeEach(function() {
        repository = new StubRepository()
        handler = new CreateContractInRevpopHandler(repository);
    });

    describe('execute', () => {
        describe('without errors', async () => {
            it('should create contract in Revpop blockchain', async () => {
                const deposit = Deposit.createByBlockchain(
                    TxHash.create(txHash).getValue() as TxHash,
                    '1000',
                    'hash_lock'
                )
                deposit.confirmByUser(RevpopAccount.create('revpop_account').getValue() as RevpopAccount)
                await repository.create(deposit)

                const command = new CreateContractInRevpop(deposit.txHash.value)
                const result = await handler.execute(command)

                expect(result.isRight(), result.value.error?.message).true
                expect(deposit.revpopContractId).not.empty
            })
        })

        describe('with errors', async () => {
            it('should return error if deposit was not found', async () => {
                const command = new CreateContractInRevpop('revpop_contract_id')
                const result = await handler.execute(command)

                expect(result.isLeft()).true
                expect(result.value).instanceof(DepositNotFound)
            })
        })
    });
});
