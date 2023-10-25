import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepositRequestTable1669206919167 implements MigrationInterface {
    name = "CreateDepositRequestTable1669206919167";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`deposit_request\` (\`id\` varchar(255) NOT NULL, \`native_account\` varchar(255) NOT NULL, \`hash_lock\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`deposit_request\``);
    }
}
