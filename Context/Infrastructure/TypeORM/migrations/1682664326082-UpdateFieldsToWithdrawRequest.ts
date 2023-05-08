import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldsToWithdrawRequest1682664326082 implements MigrationInterface {
    name = "UpdateFieldsToWithdrawRequest1682664326082";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` CHANGE \`amount_to_pay_in_RVETH\` \`amount_to_pay_in_RVETH\` decimal(15,5) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` CHANGE \`amount_to_pay_in_RVETH\` \`amount_to_pay_in_RVETH\` decimal(10,0) NOT NULL`
        );
    }
}
