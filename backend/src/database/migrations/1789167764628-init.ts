import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1789167764628 implements MigrationInterface {
    name = 'Init1789167764628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leads" ("lead_id" SERIAL NOT NULL, "name" character varying(70) NOT NULL, "phone" character varying(15) NOT NULL, "context" character varying(250) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_42ebb4366d014febbcfdef39e36" UNIQUE ("phone"), CONSTRAINT "PK_d289409667aacd43214e3036807" PRIMARY KEY ("lead_id"))`);
        await queryRunner.query(`CREATE TABLE "agents" ("agent_id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3ba3ff16246ffc499a47106d19e" PRIMARY KEY ("agent_id"))`);
        await queryRunner.query(`CREATE TABLE "call_logs" ("call_logs_id" SERIAL NOT NULL, "status" character varying(20) NOT NULL, "notes" character varying(50), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lead_id" integer NOT NULL, "agent_id" integer NOT NULL, CONSTRAINT "PK_fb226b52b1b7f25b2a62ffb4a31" PRIMARY KEY ("call_logs_id"))`);
        await queryRunner.query(`ALTER TABLE "call_logs" ADD CONSTRAINT "FK_84553310d9ec4dcd2844b9cb58c" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_logs" ADD CONSTRAINT "FK_31e36efe13477c1174e905667b0" FOREIGN KEY ("agent_id") REFERENCES "agents"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_logs" DROP CONSTRAINT "FK_31e36efe13477c1174e905667b0"`);
        await queryRunner.query(`ALTER TABLE "call_logs" DROP CONSTRAINT "FK_84553310d9ec4dcd2844b9cb58c"`);
        await queryRunner.query(`DROP TABLE "call_logs"`);
        await queryRunner.query(`DROP TABLE "agents"`);
        await queryRunner.query(`DROP TABLE "leads"`);
    }

}
