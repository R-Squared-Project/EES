import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterWalletDepositTable1659952814173 implements MigrationInterface {
    name = 'AlterWalletDepositTable1659952814173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`sessionId\` \`id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY FIRST`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`id\` \`sessionId\` varchar(255) NOT NULL`);
    }

}
