import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDefaultFieldOnScheduleTable1694555652576 implements MigrationInterface {
    name = 'AddIsDefaultFieldOnScheduleTable1694555652576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" ADD "is_default" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "is_default"`);
    }

}
