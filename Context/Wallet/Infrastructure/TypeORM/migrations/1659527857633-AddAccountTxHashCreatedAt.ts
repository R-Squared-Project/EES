import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountTxHashCreatedAt1659527857633 implements MigrationInterface {
    name = 'AddAccountTxHashCreatedAt1659527857633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`revpop_account\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`tx_hash\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`tx_hash\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`revpop_account\``);
    }

}
