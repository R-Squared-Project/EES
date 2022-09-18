#!/bin/sh

yarn typeorm migration:run -d Context/Wallet/Infrastructure/TypeORM/DataSource/WalletDataSource.ts && \
yarn typeorm migration:run -d Context/Eth/Infrastructure/TypeORM/DataSource/DataSource.ts && \
yarn typeorm migration:run -d Context/Revpop/Infrastructure/TypeORM/DataSource/DataSource.ts

yarn start
