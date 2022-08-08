import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumns1659950498329 implements MigrationInterface {
    name = 'AlterColumns1659950498329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`revpop_account\` \`revpop_account\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`tx_hash\` \`tx_hash\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`tx_hash\` \`tx_hash\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`revpop_account\` \`revpop_account\` varchar(255) NOT NULL`);
    }

}
