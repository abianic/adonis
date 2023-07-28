import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationEventTypeTablesAndProfilesTables1688703533986 implements MigrationInterface {
    name = 'AddRelationEventTypeTablesAndProfilesTables1688703533986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_a74052fca99d5943d08a0da78db"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP COLUMN "user"`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP COLUMN "team"`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD "profile" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_70d5c3e5873d5ada3a74782e5e0" FOREIGN KEY ("profile") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_type" DROP CONSTRAINT "FK_70d5c3e5873d5ada3a74782e5e0"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_63b7ba99db8962a072d5926adf5"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_63b7ba99db8962a072d5926adf5" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" DROP COLUMN "profile"`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD "team" integer`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD "user" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_a74052fca99d5943d08a0da78db" FOREIGN KEY ("team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type" ADD CONSTRAINT "FK_7a6b5cd109e076d9d41d4b39ae4" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
