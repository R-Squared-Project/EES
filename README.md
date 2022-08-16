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

### Eth context
#### Create migration:
```
yarn typeorm migration:generate -d Context/Eth/Infrastructure/TypeORM/DataSource/DataSource.ts Context/Eth/Infrastructure/TypeORM/migrations/__migrationName__
```

#### Execute migrations
```
yarn typeorm migration:run -d Context/Eth/Infrastructure/TypeORM/DataSource/DataSource.ts
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

## Tests
### Unit
Unit tests does`t use database. Just run to launch them:
```
yarn test
```

### Integration
1. Create test databases
```
docker compose exec db bash -c "./initdb_test.sh"
```
2. Migrations will be applied automatically
3. Run tests
```
yarn test:integration
```