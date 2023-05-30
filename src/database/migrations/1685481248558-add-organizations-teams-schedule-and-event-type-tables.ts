import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationsTeamsScheduleAndEventTypeTables1685481248558 implements MigrationInterface {
    name = 'AddOrganizationsTeamsScheduleAndEventTypeTables1685481248558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "user" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "organization" integer, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text NOT NULL, "user" integer, "schedule" integer, "team" integer, CONSTRAINT "PK_d968f34984d7d85d96f782872fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_f1e33ab4c278413889620c3c250" FOREIGN KEY ("organization") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_eca48844ce0e67ac294d93ba461" FOREIGN KEY ("schedule") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_a74052fca99d5943d08a0da78db" FOREIGN KEY ("team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_a74052fca99d5943d08a0da78db"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_eca48844ce0e67ac294d93ba461"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_f1e33ab4c278413889620c3c250"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9"`);
        await queryRunner.query(`DROP TABLE "event_type"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
