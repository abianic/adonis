import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentFkOnProfileTable1690414039659 implements MigrationInterface {
    name = 'AddParentFkOnProfileTable1690414039659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "parent_id" integer`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_5a173f3e25ec9d8fa3a672909c0" FOREIGN KEY ("parent_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_5a173f3e25ec9d8fa3a672909c0"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "parent_id"`);
    }

}
