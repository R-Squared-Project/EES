import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToWithdraw1685362551530 implements MigrationInterface {
    name = "AddFieldToWithdraw1685362551530";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`internal_redeem_block_number\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`internal_redeem_block_number\``);
    }
}
