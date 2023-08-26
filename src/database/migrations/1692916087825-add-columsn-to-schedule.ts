import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumsnToSchedule1692916087825 implements MigrationInterface {
    name = 'AddColumsnToSchedule1692916087825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "user"`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_status_enum" AS ENUM('pendenting', 'active', 'inactive', 'terminated')`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "status" "public"."schedule_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "profile_id" integer`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "owner" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_c9927b15da3efbbfb7f29928216" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_c2c8260a3d45b56a4a0018592f8" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_c2c8260a3d45b56a4a0018592f8"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_c9927b15da3efbbfb7f29928216"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "owner" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "profile_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_status_enum"`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "user" integer`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_fc369899de24cf5c01b97d3c7b9" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
