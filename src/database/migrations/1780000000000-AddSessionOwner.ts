import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionOwner1780000000000 implements MigrationInterface {
  name = 'AddSessionOwner1780000000000';

  private readonly indexName = 'IDX_sessions_ownerApiKeyId';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('sessions');
    if (!hasTable) return;

    const isPostgres = queryRunner.connection.options.type === 'postgres';
    const hasColumn = await queryRunner.hasColumn('sessions', 'ownerApiKeyId');

    if (!hasColumn) {
      if (isPostgres) {
        await queryRunner.query(`ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "ownerApiKeyId" varchar(36)`);
      } else {
        await queryRunner.query(`ALTER TABLE "sessions" ADD COLUMN "ownerApiKeyId" varchar(36)`);
      }
    }

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${this.indexName}" ON "sessions" ("ownerApiKeyId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('sessions');
    if (!hasTable) return;

    await queryRunner.query(`DROP INDEX IF EXISTS "${this.indexName}"`);

    const isPostgres = queryRunner.connection.options.type === 'postgres';
    const hasColumn = await queryRunner.hasColumn('sessions', 'ownerApiKeyId');
    if (hasColumn && isPostgres) {
      await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN IF EXISTS "ownerApiKeyId"`);
    }
  }
}
