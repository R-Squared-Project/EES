import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterExternalContractAddColumns1671170391764 implements MigrationInterface {
    name = 'AlterExternalContractAddColumns1671170391764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`sender\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`receiver\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`value\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`hash_lock\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`external_contract\` ADD \`time_lock\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`time_lock\``);
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`hash_lock\``);
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`value\``);
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`receiver\``);
        await queryRunner.query(`ALTER TABLE \`external_contract\` DROP COLUMN \`sender\``);
    }

}
