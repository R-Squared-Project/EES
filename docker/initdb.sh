echo "Creating wallet context database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $WALLET_DATABASE;
GRANT ALL PRIVILEGES ON $WALLET_DATABASE.* TO '$WALLET_DATABASE_USER'@'%' IDENTIFIED BY '$WALLET_DATABASE_PASSWORD'";

echo "Finished creating wallet context database and user"

echo "Creating eth context database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $ETH_DATABASE;
GRANT ALL PRIVILEGES ON $ETH_DATABASE.* TO '$ETH_DATABASE_USER'@'%' IDENTIFIED BY '$ETH_DATABASE_PASSWORD'";

echo "Finished creating eth context database and user"

echo "Creating revpop context database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $REVPOP_DATABASE;
GRANT ALL PRIVILEGES ON $REVPOP_DATABASE.* TO '$REVPOP_DATABASE_USER'@'%' IDENTIFIED BY '$REVPOP_DATABASE_PASSWORD'";

echo "Finished creating revpop context database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"