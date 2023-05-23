import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxHashToWithdraw1683536302958 implements MigrationInterface {
    name = "AddTxHashToWithdraw1683536302958";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`tx_hash\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`tx_hash\``);
    }
}
