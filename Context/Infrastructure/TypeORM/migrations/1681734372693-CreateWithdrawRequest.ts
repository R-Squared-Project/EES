import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWithdrawRequest1681734372693 implements MigrationInterface {
    name = 'CreateWithdrawRequest1681734372693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`withdraw_request\` (\`id\` varchar(255) NOT NULL, \`revpop_account\` varchar(255) NOT NULL, \`hash_lock\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`withdraw_request\``);
    }

}
