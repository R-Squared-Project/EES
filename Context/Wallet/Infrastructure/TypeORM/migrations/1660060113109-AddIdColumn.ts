import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdColumn1660060113109 implements MigrationInterface {
    name = 'AddIdColumn1660060113109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`session_id\` varchar(255) NOT NULL AFTER \`status\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`session_id\``);
    }

}
