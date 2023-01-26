#!/bin/sh

yarn typeorm migration:run -d Context/Infrastructure/TypeORM/DataSource/DataSource.ts

yarn start
