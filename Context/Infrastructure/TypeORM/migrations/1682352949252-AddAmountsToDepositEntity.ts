import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAmountsToDepositEntity1682352949252 implements MigrationInterface {
    name = "AddAmountsToDepositEntity1682352949252";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`minted_amount\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`burned_amount\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`burned_amount\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`minted_amount\``);
    }
}
