import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugFieldOnProfileTable1693941153920 implements MigrationInterface {
    name = 'AddSlugFieldOnProfileTable1693941153920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "slug" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "UQ_320e259757524e1b21cd08d0f1f" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "UQ_320e259757524e1b21cd08d0f1f"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "slug"`);
    }

}
