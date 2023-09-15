import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDaysEnumOnAvailabilityTable1694541309598 implements MigrationInterface {
    name = 'UpdateDaysEnumOnAvailabilityTable1694541309598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."availability_day_enum" RENAME TO "availability_day_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."availability_day_enum" AS ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')`);
        await queryRunner.query(`ALTER TABLE "availability" ALTER COLUMN "day" TYPE "public"."availability_day_enum" USING "day"::"text"::"public"."availability_day_enum"`);
        await queryRunner.query(`DROP TYPE "public"."availability_day_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."availability_day_enum_old" AS ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')`);
        await queryRunner.query(`ALTER TABLE "availability" ALTER COLUMN "day" TYPE "public"."availability_day_enum_old" USING "day"::"text"::"public"."availability_day_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."availability_day_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."availability_day_enum_old" RENAME TO "availability_day_enum"`);
    }

}
