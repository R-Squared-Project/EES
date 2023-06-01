import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToWithdrawEntity1685541355100 implements MigrationInterface {
    name = "AddFieldToWithdrawEntity1685541355100";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw\` ADD \`external_blockchain_refund_tx_hash\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`external_blockchain_refund_tx_hash\``);
    }
}
