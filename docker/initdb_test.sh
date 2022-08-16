mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $WALLET_DATABASE_TEST;
GRANT ALL PRIVILEGES ON $WALLET_DATABASE_TEST.* TO '$WALLET_DATABASE_USER'@'%' IDENTIFIED BY '$WALLET_DATABASE_PASSWORD'";

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $ETH_DATABASE_TEST;
GRANT ALL PRIVILEGES ON $ETH_DATABASE_TEST.* TO '$ETH_DATABASE_USER'@'%' IDENTIFIED BY '$ETH_DATABASE_PASSWORD'";

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $REVPOP_DATABASE_TEST;
GRANT ALL PRIVILEGES ON $REVPOP_DATABASE_TEST.* TO '$REVPOP_DATABASE_USER'@'%' IDENTIFIED BY '$REVPOP_DATABASE_PASSWORD'";

echo "Finished creating test databases"