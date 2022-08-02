import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepositTable1659449989436 implements MigrationInterface {
    name = 'CreateDepositTable1659449989436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`deposit\` (\`sessionId\` varchar(255) NOT NULL, \`status\` int NOT NULL, PRIMARY KEY (\`sessionId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`deposit\``);
    }

}
