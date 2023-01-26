import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepositTable1669154595923 implements MigrationInterface {
    name = 'CreateDepositTable1669154595923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`deposit\` (\`id\` varchar(255) NOT NULL, \`revpop_account\` varchar(255) NOT NULL, \`hash_lock\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`deposit\``);
    }
}
