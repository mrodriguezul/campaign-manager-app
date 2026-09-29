import { MigrationInterface, QueryRunner } from "typeorm";

export class LoadData1790655572865 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "agents"
                ("name", "email", "password", "created_at", "updated_at")
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, NULL)`,
            [
                "Example",
                "example@gmail.com",
                "$2b$10$0fkMy65Xcd2j1AYLKc72memJMdPH5.k8aUyrmZDo/.SwGkHrHIwvK",
            ],
        );

        await queryRunner.query(
            `INSERT INTO "leads"
                ("name", "phone", "context", "created_at", "updated_at")
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, NULL),
                    ($4, $5, $6, CURRENT_TIMESTAMP, NULL)`,
            [
                "Pedro",
                "+12345678942",
                "promo TV",
                "Juan",
                "+12345678943",
                "promo TV",
            ],
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "leads"
             WHERE "phone" IN ($1, $2)`,
            ["+12345678942", "+12345678943"],
        );

        await queryRunner.query(
            `DELETE FROM "agents"
             WHERE "email" = $1`,
            ["example@gmail.com"],
        );
    }
}