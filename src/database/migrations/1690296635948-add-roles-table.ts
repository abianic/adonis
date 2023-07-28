import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesTable1690296635948 implements MigrationInterface {
    name = 'AddRolesTable1690296635948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rol" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(45) NOT NULL, CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "status" SET DEFAULT 'pendenting'`);
        await queryRunner.query(`DROP TABLE "rol"`);
    }

}
