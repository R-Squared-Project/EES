import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBurnInternalTxHashToDeposit1679924185289 implements MigrationInterface {
    name = 'AddBurnInternalTxHashToDeposit1679924185289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`internal_blockchain_burn_tx_hash\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`internal_blockchain_burn_tx_hash\``);
    }
}
