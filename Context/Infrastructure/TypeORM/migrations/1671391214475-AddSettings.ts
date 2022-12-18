import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettings1671391214475 implements MigrationInterface {
    name = 'AddSettings1671391214475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, UNIQUE INDEX \`name_idx\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`name_idx\` ON \`setting\``);
        await queryRunner.query(`DROP TABLE \`setting\``);
    }

}
