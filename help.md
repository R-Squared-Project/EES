# Help

## Deposit

### Monitor ETH transaction Status changes to 1
supervisorctl start monitor_ethereum_transaction
npm run dev:monitor:ethereum_transactions

### Create contracts in internal blockchain Status changes to 5
supervisorctl start worker_create_in_internal_blockchain
npm run dev:worker:create_in_internal_blockchain

### Monitor created contracts in internal blockchain Status changes to 10
supervisorctl start monitor_deposit_internal_contract_created
npm run dev:monitor:deposit_internal_contract_created

### Check Redeemed In An Internal Blockchain Status changes to 15
supervisorctl start monitor_deposit_internal_contract_redeemed
npm run dev:monitor:deposit_internal_contract_redeemed

### Redeem in external blockchain Status changes to 20
supervisorctl start worker_redeem_in_external_blockchain
npm run dev:worker:redeem_in_external_blockchain

### Monitor ETH transaction for redeems Status does not change only the queue
supervisorctl start monitor_ethereum_transaction
npm run dev:monitor:ethereum_transactions

### Confirm redeeming in external blockchain Status changes to 25 (Completed)
supervisorctl start worker_external_contract_redeem
npm run dev:worker:external_contract_redeem

### Monitor deposit internal contract refunded 
supervisorctl start deposit_internal_contract_refunded
npm run dev:monitor:deposit_internal_contract_refunded

### Monitor Deposit Internal Contract Burned
supervisorctl start deposit_internal_contract_burned
npm run dev:monitor:deposit_internal_contract_burned


## Withdraw

### Monitor withdraw internal contract created Status changes to 5
supervisorctl start monitor_withdraw_internal_contract_created
npm run dev:monitor:withdraw_internal_contract_created

### Found Withdraw  Internal Contract Creation Status changes to 10
supervisorctl start found_withdraw_internal_contract_creation
npm run dev:found:withdraw_internal_contract_creation

### Worker Create Withdrawal External Contract Status changes to 15 wait 2 lines
supervisorctl start worker_create_withdrawal_external_contract
npm run dev:worker:create_withdrawal_external_contract

### Monitor ETH transaction (Contract Create) Status changes to 20
supervisorctl start monitor_ethereum_transaction
npm run dev:monitor:ethereum_transactions

### Monitor ETH transaction (Contract Redeem) Status does not change only the queue
supervisorctl start monitor_ethereum_transaction
npm run dev:monitor:ethereum_transactions

### Worker to Confirm Withdraw External Contract Redeemed Status changes to 25
supervisorctl start worker_withdraw_external_contract_redeemed
npm run dev:worker:withdraw_external_contract_redeemed

### Redeem Withdrawal Internal Contract Status changes to 30
supervisorctl start execute_withdraw_internal_contract_redeem
npm run dev:execute:withdraw_internal_contract_redeem

### Monitor Withdraw Internal Contract Redeem Status does not change only the queue
supervisorctl start monitor_withdraw_internal_contract_redeem
npm run dev:monitor:withdraw_internal_contract_redeem

### Check Redeem Transaction For Internal Blockchain Is Successful Status changes to 35
supervisorctl start monitor_withdraw_internal_contract_redeem_processed
npm run dev:monitor:withdraw_internal_contract_redeem_processed

### Process Withdrawal External Contract Refund Status changes to 100
supervisorctl start monitor_external_withdraw_contract_timelock
npm run dev:monitor:external_withdraw_contract_timelock

### Monitor ETH transaction (Contract Refunded) Status changes to 105
supervisorctl start monitor_ethereum_transaction
npm run dev:monitor:ethereum_transactions

### Execute Withdraw Internal Contract Refund Status changes to 110
supervisorctl start execute_withdraw_internal_contract_refund
npm run dev:execute:withdraw_internal_contract_refund
