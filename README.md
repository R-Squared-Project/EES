Run domain tests: `yarn test`

Run eslint: `yarn eslint .`

## Migrations
### Wallet context
#### Create migration: 
```
yarn typeorm migration:generate -d Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource.ts Context/Wallet/Infrastructure/TypeORM/migrations/__migrationName__
```

#### Execute migrations
```
yarn typeorm migration:run -d Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource.ts
```
### Revpop context
#### Create migration:
```
yarn typeorm migration:generate -d Context/Revpop/Infrastructure/TypeORM/DataSource/DataSource.ts Context/Revpop/Infrastructure/TypeORM/migrations/__migrationName__
```

#### Execute migrations
```
yarn typeorm migration:run -d Context/Revpop/Infrastructure/TypeORM/DataSource/DataSource.ts
```