import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailabilityTable1693112059548 implements MigrationInterface {
    name = 'AddAvailabilityTable1693112059548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."availability_day_enum" AS ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')`);
        await queryRunner.query(`CREATE TYPE "public"."availability_status_enum" AS ENUM('pendenting', 'active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "day" "public"."availability_day_enum" NOT NULL, "begin_at" TIME NOT NULL, "end_at" TIME NOT NULL, "status" "public"."availability_status_enum" NOT NULL DEFAULT 'active', "schedule_id" integer NOT NULL, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_9f10e9344e85a3ee1548598327f" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_9f10e9344e85a3ee1548598327f"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TYPE "public"."availability_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."availability_day_enum"`);
    }

}
