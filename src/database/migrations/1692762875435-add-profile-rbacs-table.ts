import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileRbacTable1692762875435 implements MigrationInterface {
    name = 'AddProfileRbacTable1692762875435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profile_rbac_status_enum" AS ENUM('pendenting', 'active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "profile_rbac" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."profile_rbac_status_enum" NOT NULL DEFAULT 'pendenting', "user_id" integer NOT NULL, "rol_id" integer NOT NULL, "profile_id" integer NOT NULL, CONSTRAINT "PK_bdc0dd3acf357cb002c2faa424f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_rbac" ADD CONSTRAINT "FK_6689c3b5d766188046e7517b73a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_rbac" ADD CONSTRAINT "FK_deaf3f73e88442c89aaf821b447" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_rbac" ADD CONSTRAINT "FK_8278caca1e39ac56966f9cda830" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_rbac" DROP CONSTRAINT "FK_8278caca1e39ac56966f9cda830"`);
        await queryRunner.query(`ALTER TABLE "profile_rbac" DROP CONSTRAINT "FK_deaf3f73e88442c89aaf821b447"`);
        await queryRunner.query(`ALTER TABLE "profile_rbac" DROP CONSTRAINT "FK_6689c3b5d766188046e7517b73a"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "profile_rbac"`);
        await queryRunner.query(`DROP TYPE "public"."profile_rbac_status_enum"`);
    }

}
