# Help

## Deposit

### Monitor ETH transaction Status changes to 1
supervisorctl start monitor_ethereum_transaction
yarn monitor:ethereum_transactions

### Create contracts in internal blockchain Status changes to 5
supervisorctl start worker_create_in_internal_blockchain
yarn worker:create_in_internal_blockchain

### Monitor created contracts in internal blockchain Status changes to 10
supervisorctl start monitor_deposit_internal_contract_created
yarn monitor:deposit_internal_contract_created

### Check Redeemed In An Internal Blockchain Status changes to 15
supervisorctl start monitor_deposit_internal_contract_redeemed
yarn monitor:deposit_internal_contract_redeemed

### Redeem in external blockchain Status changes to 20
supervisorctl start worker_redeem_in_external_blockchain
yarn worker:redeem_in_external_blockchain

### Monitor ETH transaction for redeems Status does not change only the queue
supervisorctl start monitor_ethereum_transaction
yarn monitor:ethereum_transactions

### Confirm redeeming in external blockchain Status changes to 25 (Completed)
supervisorctl start worker_external_contract_redeem
yarn worker:external_contract_redeem

### Monitor deposit internal contract refunded
supervisorctl start deposit_internal_contract_refunded
yarn monitor:deposit_internal_contract_refunded

### Monitor Deposit Internal Contract Burned
supervisorctl start deposit_internal_contract_burned
yarn monitor:deposit_internal_contract_burned

## Withdraw

### Monitor withdraw internal contract created Status changes to 5
supervisorctl start monitor_withdraw_internal_contract_created
yarn monitor:withdraw_internal_contract_created

### Found Withdraw  Internal Contract Creation Status changes to 10
supervisorctl start found_withdraw_internal_contract_creation
yarn found:withdraw_internal_contract_creation

### Worker Create Withdrawal External Contract Status changes to 15
supervisorctl start worker_create_withdrawal_external_contract
yarn worker:create_withdrawal_external_contract

### Monitor ETH transaction (Contract Create) Status changes to 20
supervisorctl start monitor_ethereum_transaction
yarn monitor:ethereum_transactions

### Monitor ETH transaction (Contract Redeem) Status does not change only the queue
supervisorctl start monitor_ethereum_transaction
yarn monitor:ethereum_transactions

### Worker to Confirm Withdraw External Contract Redeemed 
supervisorctl start worker_withdraw_external_contract_redeemed
yarn worker:withdraw_external_contract_redeemed

### Redeem Withdrawal Internal Contract 
supervisorctl start execute_withdraw_internal_contract_redeem
yarn execute:withdraw_internal_contract_redeem

### Monitor Withdraw Internal Contract Redeem 
supervisorctl start monitor_withdraw_internal_contract_redeem
yarn monitor:withdraw_internal_contract_redeem

### Check Redeem Transaction For Internal Blockchain Is Successful 
supervisorctl start monitor_withdraw_internal_contract_redeem_processed
yarn monitor:withdraw_internal_contract_redeem_processed

### Process Withdrawal External Contract Refund
supervisorctl start monitor_external_withdraw_contract_timelock
yarn monitor:external_withdraw_contract_timelock

