import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterExternalContractAddTxHash1675867776847 implements MigrationInterface {
    name = 'AlterExternalContractAddTxHash1675867776847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`tx_hash\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`tx_hash\``);
    }
}
