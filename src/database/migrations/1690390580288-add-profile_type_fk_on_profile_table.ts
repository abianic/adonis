import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileTypeFkOnProfileTable1690390580288 implements MigrationInterface {
    name = 'AddProfileTypeFkOnProfileTable1690390580288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "profile_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_99374c22ecf14befe72b8ebea5e" FOREIGN KEY ("profile_type_id") REFERENCES "profile_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_99374c22ecf14befe72b8ebea5e"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "profile_type_id"`);
    }

}
