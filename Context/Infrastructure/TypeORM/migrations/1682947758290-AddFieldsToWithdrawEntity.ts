import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToWithdrawEntity1682947758290 implements MigrationInterface {
    name = "AddFieldsToWithdrawEntity1682947758290";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`error_message\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`hashlock\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`timelock\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`amount_of_htlc\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`amount_of_withdrawal_fee\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`asset_of_withdrawal_fee\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`asset_of_withdrawal_fee\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`amount_of_withdrawal_fee\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`amount_of_htlc\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`timelock\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`hashlock\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`error_message\``);
    }
}
