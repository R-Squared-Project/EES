import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterInternalContractAlterId1677154192293 implements MigrationInterface {
    name = 'AlterInternalContractAlterId1677154192293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_579bbfff76624a8e2bfdbf8d66\` ON \`deposit\``);
        await queryRunner.query(`DROP INDEX \`IDX_e0920857a2b620f4541617c8d7\` ON \`deposit\``);
        await queryRunner.query(`DROP INDEX \`IDX_6cc3eee6365b0a115875d7b35a\` ON \`deposit\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP FOREIGN KEY \`FK_6cc3eee6365b0a115875d7b35a8\``);
        await queryRunner.query(`DROP INDEX \`REL_6cc3eee6365b0a115875d7b35a\` ON \`deposit\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`internal_contract_id\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`internal_contract_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD UNIQUE INDEX \`IDX_6cc3eee6365b0a115875d7b35a\` (\`internal_contract_id\`)`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6cc3eee6365b0a115875d7b35a\` ON \`deposit\` (\`internal_contract_id\`)`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD CONSTRAINT \`FK_6cc3eee6365b0a115875d7b35a8\` FOREIGN KEY (\`internal_contract_id\`) REFERENCES \`internal_contract\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP FOREIGN KEY \`FK_6cc3eee6365b0a115875d7b35a8\``);
        await queryRunner.query(`DROP INDEX \`REL_6cc3eee6365b0a115875d7b35a\` ON \`deposit\``);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`internal_contract\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP INDEX \`IDX_6cc3eee6365b0a115875d7b35a\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` DROP COLUMN \`internal_contract_id\``);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD \`internal_contract_id\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6cc3eee6365b0a115875d7b35a\` ON \`deposit\` (\`internal_contract_id\`)`);
        await queryRunner.query(`ALTER TABLE \`deposit\` ADD CONSTRAINT \`FK_6cc3eee6365b0a115875d7b35a8\` FOREIGN KEY (\`internal_contract_id\`) REFERENCES \`internal_contract\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6cc3eee6365b0a115875d7b35a\` ON \`deposit\` (\`internal_contract_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e0920857a2b620f4541617c8d7\` ON \`deposit\` (\`external_contract_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_579bbfff76624a8e2bfdbf8d66\` ON \`deposit\` (\`deposit_request_id\`)`);
    }

}
