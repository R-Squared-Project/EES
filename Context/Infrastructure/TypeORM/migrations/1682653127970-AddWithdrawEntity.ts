import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWithdrawEntity1682653127970 implements MigrationInterface {
    name = "AddWithdrawEntity1682653127970";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`withdraw\` (\`id\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`transfer_operation_id\` varchar(255) NOT NULL, \`htlc_create_operation_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`withdraw_request_id\` varchar(255) NULL, \`external_contract_id\` varchar(255) NULL, \`internal_contract_id\` varchar(255) NULL, UNIQUE INDEX \`REL_33e63055f106a932514ef174bf\` (\`withdraw_request_id\`), UNIQUE INDEX \`REL_c46ae98dca500a71386f46ec5d\` (\`external_contract_id\`), UNIQUE INDEX \`REL_7f4c9a7ed17af305d05a755d84\` (\`internal_contract_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` ADD \`status\` int NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`withdraw\` ADD CONSTRAINT \`FK_33e63055f106a932514ef174bfa\` FOREIGN KEY (\`withdraw_request_id\`) REFERENCES \`withdraw_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`withdraw\` ADD CONSTRAINT \`FK_c46ae98dca500a71386f46ec5d7\` FOREIGN KEY (\`external_contract_id\`) REFERENCES \`external_contract\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`withdraw\` ADD CONSTRAINT \`FK_7f4c9a7ed17af305d05a755d845\` FOREIGN KEY (\`internal_contract_id\`) REFERENCES \`internal_contract\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP FOREIGN KEY \`FK_7f4c9a7ed17af305d05a755d845\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP FOREIGN KEY \`FK_c46ae98dca500a71386f46ec5d7\``);
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP FOREIGN KEY \`FK_33e63055f106a932514ef174bfa\``);
        await queryRunner.query(`ALTER TABLE \`withdraw_request\` DROP COLUMN \`status\``);
        await queryRunner.query(`DROP INDEX \`REL_7f4c9a7ed17af305d05a755d84\` ON \`withdraw\``);
        await queryRunner.query(`DROP INDEX \`REL_c46ae98dca500a71386f46ec5d\` ON \`withdraw\``);
        await queryRunner.query(`DROP INDEX \`REL_33e63055f106a932514ef174bf\` ON \`withdraw\``);
        await queryRunner.query(`DROP TABLE \`withdraw\``);
    }
}
