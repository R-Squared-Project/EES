import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToWithdrawRequest1684933667124 implements MigrationInterface {
    name = "AddNewFieldToWithdrawRequest1684933667124";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` ADD \`withdrawal_fee_amount\` decimal(15,5) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` ADD \`withdrawal_fee_currency\` varchar(255) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`withdrawal_fee_currency\``);
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`withdrawal_fee_amount\``);
    }
}
