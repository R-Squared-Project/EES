import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDepositTableAddValueHashLockRevpopContractId1661428671744 implements MigrationInterface {
    name = 'AlterDepositTableAddValueHashLockRevpopContractId1661428671744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`value\` varchar(255) NULL AFTER \`tx_hash\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`hash_lock\` varchar(255) NOT NULL AFTER \`value\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`revpop_contract_id\` varchar(255) NULL AFTER \`hash_lock\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`tx_hash\` \`tx_hash\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` CHANGE \`tx_hash\` \`tx_hash\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`revpop_contract_id\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`hash_lock\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`value\``);
    }

}
