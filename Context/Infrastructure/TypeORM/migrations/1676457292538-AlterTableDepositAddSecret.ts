import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableDepositAddSecret1676457292538 implements MigrationInterface {
    name = 'AlterTableDepositAddSecret1676457292538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`secret\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`secret\``);
    }

}
