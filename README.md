Run domain tests: `yarn test`

Run eslint: `yarn eslint .`

## Docker

Just run `docker compose up -d`

To check that all work fun execute request:
```
curl -i http://localhost:3000/deposit/initialize
```
HTTP 200 status and `sessionId` should be received in response

## Migrations
#### Create migration:
```
yarn typeorm migration:generate -d Context/Infrastructure/TypeORM/DataSource/DataSource.ts Context/Infrastructure/TypeORM/migrations/__migrationName__
```

#### Execute migrations
```
yarn typeorm migration:run -d Context/Infrastructure/TypeORM/DataSource/DataSource.ts
```

## Tests
### Unit
Unit tests doesn't use database. Just run this command to execute them:
```
yarn test
```

### Integration
1. Create test databases
```
docker compose exec db bash -c "./initdb_test.sh"
```
2. Execute migrations
```
NODE_ENV=test yarn typeorm migration:run -d Context/Infrastructure/TypeORM/DataSource/DataSource.ts
```
3. Run tests
```
yarn test:integration
```
