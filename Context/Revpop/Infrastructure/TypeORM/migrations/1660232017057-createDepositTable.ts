import { MigrationInterface, QueryRunner } from "typeorm";

export class createDepositTable1660232017057 implements MigrationInterface {
    name = 'createDepositTable1660232017057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`deposit\` (\`id\` varchar(255) NOT NULL, \`revpop_account\` varchar(255) NULL, \`tx_hash\` varchar(255) NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`deposit\``);
    }

}
