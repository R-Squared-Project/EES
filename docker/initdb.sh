echo "Creating wallet context database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $WALLET_DATABASE;
GRANT ALL PRIVILEGES ON $WALLET_DATABASE.* TO '$WALLET_DATABASE_USER'@'%' IDENTIFIED BY '$WALLET_DATABASE_PASSWORD';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"

echo "Finished creating wallet context database and user"