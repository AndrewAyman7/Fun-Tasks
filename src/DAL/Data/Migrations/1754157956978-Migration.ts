import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754157956978 implements MigrationInterface {
    name = 'Migration1754157956978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduled_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "executeAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "executedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, CONSTRAINT "PK_59a1f1e0d902729bdfe3d02c089" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scheduled_event" ADD CONSTRAINT "FK_088937112c37fdf696e22e34321" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_event" DROP CONSTRAINT "FK_088937112c37fdf696e22e34321"`);
        await queryRunner.query(`DROP TABLE "scheduled_event"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
