import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEmailUnico1789251917778 implements MigrationInterface {
    name = 'UserEmailUnico1789251917778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" ADD CONSTRAINT "UQ_5fdef501c63984b1b98abb1e68c" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" DROP CONSTRAINT "UQ_5fdef501c63984b1b98abb1e68c"`);
    }

}
