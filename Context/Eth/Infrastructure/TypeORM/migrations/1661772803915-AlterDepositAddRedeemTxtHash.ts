import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDepositAddRedeemTxtHash1661772803915 implements MigrationInterface {
    name = 'AlterDepositAddRedeemTxtHash1661772803915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`redeem_tx_hash\` varchar(255) NULL AFTER time_lock`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`redeem_tx_hash\``);
    }

}
