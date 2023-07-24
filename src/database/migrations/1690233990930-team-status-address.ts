import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamStatusAddress1690233990930 implements MigrationInterface {
    name = 'TeamStatusAddress1690233990930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."team_status_enum" AS ENUM('pendenting', 'active', 'inactive', 'terminated')`);
        await queryRunner.query(`ALTER TABLE "team" ADD "status" "public"."team_status_enum" NOT NULL DEFAULT 'pendenting'`);
        await queryRunner.query(`ALTER TABLE "team" ADD "address" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."team_status_enum"`);
    }

}
