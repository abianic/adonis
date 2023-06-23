import { MigrationInterface, QueryRunner } from "typeorm";

export class  ProfileProfileTypes1687464770539 implements MigrationInterface {
    name = ' ProfileProfileTypes1687464770539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "user" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_status_enum" AS ENUM('pendenting', 'active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(45) NOT NULL, "address" character varying(255) NOT NULL, "status" "public"."profile_status_enum" NOT NULL DEFAULT 'pendenting', "owner" integer NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "organization" integer, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text NOT NULL, "user" integer NOT NULL, "schedule" integer, "team" integer, CONSTRAINT "PK_d968f34984d7d85d96f782872fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(45) NOT NULL, CONSTRAINT "PK_7047b934cd27af7388e3620ae21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_f1e33ab4c278413889620c3c250" FOREIGN KEY ("organization") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_eca48844ce0e67ac294d93ba461" FOREIGN KEY ("schedule") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_a74052fca99d5943d08a0da78db" FOREIGN KEY ("team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_a74052fca99d5943d08a0da78db"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_eca48844ce0e67ac294d93ba461"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_f1e33ab4c278413889620c3c250"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9"`);
        await queryRunner.query(`DROP TABLE "profile_type"`);
        await queryRunner.query(`DROP TABLE "event_type"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_status_enum"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
