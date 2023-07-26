import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLengthFieldOnEventTypeTable1689972757984 implements MigrationInterface {
    name = 'AddLengthFieldOnEventTypeTable1689972757984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" ADD "length" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" DROP COLUMN "length"`);
    }

}
