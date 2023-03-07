import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableDepositAddExternalBlockchainRedeemTxHash1673549379592 implements MigrationInterface {
    name = 'AlterTableDepositAddExternalBlockchainRedeemTxHash1673549379592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`external_blockchain_redeem_tx_hash\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`external_blockchain_redeem_tx_hash\``);
    }

}
