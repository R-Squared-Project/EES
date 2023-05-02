import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeHashLockNullableInWithdrawRequest1682426724720 implements MigrationInterface {
    name = "MakeHashLockNullableInWithdrawRequest1682426724720";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit_request\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NULL`);
        await queryRunner.query(
            `ALTER TABLE \`external_contract\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`withdraw_request\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`external_contract\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`deposit_request\` CHANGE \`hash_lock\` \`hash_lock\` varchar(255) NOT NULL`
        );
    }
}
