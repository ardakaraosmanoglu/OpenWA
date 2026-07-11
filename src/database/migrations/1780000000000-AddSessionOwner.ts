import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddSessionOwner1780000000000 implements MigrationInterface {
  name = 'AddSessionOwner1780000000000';

  private readonly indexName = 'IDX_sessions_ownerApiKeyId';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('sessions');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn('sessions', 'ownerApiKeyId');
    if (!hasColumn) {
      await queryRunner.addColumn(
        'sessions',
        new TableColumn({
          name: 'ownerApiKeyId',
          type: 'varchar',
          length: '36',
          isNullable: true,
        }),
      );
    }

    const table = await queryRunner.getTable('sessions');
    const indexExists = table?.indices.some(i => i.name === this.indexName);
    if (!indexExists) {
      await queryRunner.createIndex(
        'sessions',
        new TableIndex({ name: this.indexName, columnNames: ['ownerApiKeyId'] }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('sessions');
    if (!hasTable) return;

    const table = await queryRunner.getTable('sessions');
    const indexExists = table?.indices.some(i => i.name === this.indexName);
    if (indexExists) {
      await queryRunner.dropIndex('sessions', this.indexName);
    }

    const hasColumn = await queryRunner.hasColumn('sessions', 'ownerApiKeyId');
    if (hasColumn) {
      await queryRunner.dropColumn('sessions', 'ownerApiKeyId');
    }
  }
}
