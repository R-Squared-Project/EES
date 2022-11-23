echo "Creating database and user"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"CREATE DATABASE IF NOT EXISTS $DATABASE;
GRANT ALL PRIVILEGES ON $DATABASE.* TO '$DATABASE_USER'@'%' IDENTIFIED BY '$DATABASE_PASSWORD'";

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
