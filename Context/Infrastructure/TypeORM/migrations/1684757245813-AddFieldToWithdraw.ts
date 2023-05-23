import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToWithdraw1684757245813 implements MigrationInterface {
    name = "AddFieldToWithdraw1684757245813";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw\` ADD \`external_blockchain_redeem_tx_hash\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`external_blockchain_redeem_tx_hash\``);
    }
}
