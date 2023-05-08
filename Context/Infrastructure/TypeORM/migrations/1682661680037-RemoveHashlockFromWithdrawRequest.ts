import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveHashlockFromWithdrawRequest1682661680037 implements MigrationInterface {
    name = "RemoveHashlockFromWithdrawRequest1682661680037";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`hash_lock\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` ADD \`hash_lock\` varchar(255) NULL`);
    }
}
