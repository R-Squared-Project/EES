import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToWithdrawRequest1682663683463 implements MigrationInterface {
    name = "AddFieldsToWithdrawRequest1682663683463";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` ADD \`amount_to_pay_in_RQETH\` decimal NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` ADD \`address_of_user_in_ethereum\` varchar(255) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`address_of_user_in_ethereum\``);
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`amount_to_pay_in_RQETH\``);
    }
}
