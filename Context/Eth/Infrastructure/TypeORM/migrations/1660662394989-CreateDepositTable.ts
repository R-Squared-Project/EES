import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepositTable1660662394989 implements MigrationInterface {
    name = 'CreateDepositTable1660662394989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`deposit\` (\`id\` varchar(255) NOT NULL, \`tx_hash\` varchar(255) NOT NULL, \`contract_id\` varchar(255) NOT NULL, \`sender\` varchar(255) NOT NULL, \`receiver\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`hash_lock\` varchar(255) NOT NULL, \`time_lock\` datetime NOT NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`deposit\``);
    }

}
