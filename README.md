Run domain tests: `yarn test`

Run eslint: `yarn eslint .`

## Migrations
### Create migration for wallet context: 
```
yarn typeorm migration:generate -d Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource.ts Context/Wallet/Infrastructure/TypeORM/migrations/__migrationName__
```

### Execute migrations
```
yarn typeorm migration:run -d Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource.ts
```