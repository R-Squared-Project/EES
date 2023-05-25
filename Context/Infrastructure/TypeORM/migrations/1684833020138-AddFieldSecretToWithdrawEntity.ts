import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldSecretToWithdrawEntity1684833020138 implements MigrationInterface {
    name = "AddFieldSecretToWithdrawEntity1684833020138";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD \`secret\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP COLUMN \`secret\``);
    }
}
