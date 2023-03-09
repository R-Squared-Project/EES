import {expect} from 'chai';
import InternalBlockchain from "context/InternalBlockchain/InternalBlockchain";
import InternalBlockchainStubRepository from "context/InternalBlockchain/Repository/StubRepository";
import GetLastDepositContracts
    from "context/Application/Query/InternalBlockchain/GetLastDepositContracts/GetLastDepositContracts";
import GetLastDepositContractsHandler
    from "context/Application/Query/InternalBlockchain/GetLastDepositContracts/GetLastDepositContractsHandler";
import Setting from "context/Setting/Setting";
import {createContract} from "tests/Helpers/InternalBlockchain/Contract";

describe('GetLastDepositContractsHandler', () => {
    let internalBlockchain: InternalBlockchain
    let internalBlockchainRepository: InternalBlockchainStubRepository
    let settings: Setting
    let handler: GetLastDepositContractsHandler

    beforeEach(async () => {
        internalBlockchain = await InternalBlockchain.init({repository: 'stub'})
        settings = new Setting({repository: 'stub'})
        internalBlockchainRepository = internalBlockchain.repository as InternalBlockchainStubRepository
        handler = new GetLastDepositContractsHandler(internalBlockchain, settings)
    });

    describe('execute', () => {
        describe('success', () => {
            it('should empty response', async () => {
                const query = new GetLastDepositContracts()
                const result = await handler.execute(query)
                expect(result.contracts).empty
            })

            it('should return one contract', async () => {
                internalBlockchainRepository.addInternalContract(createContract())
                const query = new GetLastDepositContracts()
                const result = await handler.execute(query)
                expect(result.contracts).length(1)

                const contract = result.contracts[0]
                expect(contract.id).equals
            })

            it('should return contract with correct parameters', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.2',
                    externalId: '14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
                }))
                const query = new GetLastDepositContracts()
                const result = await handler.execute(query)

                const contract = result.contracts[0]
                expect(contract.id).equals('1.16.2')
                expect(contract.externalId).equals('14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c')
            })

            it('should return only deposit contracts', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.2',
                    externalId: ''
                }))
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.3',
                    externalId: '14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
                }))
                const query = new GetLastDepositContracts()
                const result = await handler.execute(query)

                expect(result.contracts).length(1)

                const contract = result.contracts[0]
                expect(contract.id).equals('1.16.3')
                expect(contract.externalId).equals('14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c')
            })

            it('should return only new contract', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.2',
                    externalId: '14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55b'
                }))
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.3',
                    externalId: '14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
                }))
                settings.save('deposit_last_processed_internal_contract', '1.16.2')

                const query = new GetLastDepositContracts()
                const result = await handler.execute(query)

                expect(result.contracts).length(1)

                const contract = result.contracts[0]
                expect(contract.id).equals('1.16.3')
                expect(contract.externalId).equals('14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c')
            })
        })

        describe('setting', () => {
            it('should save last processed contract', async () => {
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.2',
                    externalId: ''
                }))
                internalBlockchainRepository.addInternalContract(createContract({
                    id: '1.16.3',
                    externalId: '14383da019a0dafdf459d62c6f9c1aaa9e4d0f16554b5c493e85eb4a3dfac55c'
                }))
                const query = new GetLastDepositContracts()
                await handler.execute(query)

                const lastProcessedContract = await settings.load('deposit_last_processed_internal_contract', false)
                expect(lastProcessedContract).not.false
                expect(lastProcessedContract).equals('1.16.3')
            })
        })
    });
});
