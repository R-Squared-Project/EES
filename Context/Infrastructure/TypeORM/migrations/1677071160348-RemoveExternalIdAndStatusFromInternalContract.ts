import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveExternalIdAndStatusFromInternalContract1677071160348 implements MigrationInterface {
    name = 'RemoveExternalIdAndStatusFromInternalContract1677071160348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`internal_contract\` DROP COLUMN \`externalId\``);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` DROP COLUMN \`status\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`internal_contract\` ADD \`status\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` ADD \`externalId\` varchar(255) NOT NULL`);
    }

}
