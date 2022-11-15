import { Prisma, PrismaClient } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import {
  Body,
  createHandler,
  Delete, Post, ValidationPipe
} from 'next-api-decorators';
import * as R from 'ramda';
const DB = new PrismaClient();

class MultipleID {
  @IsNotEmpty()
  ids: string[];
}

class Handler {
  // * 여러 항목 복사
  @Post()
  async copies(@Body(ValidationPipe) body: MultipleID) {
    const { ids } = body;

    // * 전체 조회

    const columns = [
      'id',
      'copied_id',
      'parent_id',
      'author_id',
      'status',
      'type',
      'thumbnail',
      'name',
      'description',
      'content',
      'tags',
    ];
    const insert = `
      INSERT INTO "Storage" (${R.pipe(R.drop(1), R.join(','))(columns)})
      WITH RECURSIVE hierarchy AS (
        SELECT ${columns.join(', ')}
        FROM "Storage"
        WHERE parent_id IN (${ids}) OR id IN (${ids})
        UNION
        SELECT ${R.pipe(
          R.map((v: string) => `s.${v}`),
          R.join(',')
        )(columns)}
        FROM "Storage" s
        INNER JOIN hierarchy t ON s.parent_id = t.id
      )
      SELECT CASE WHEN copied_id = 0 THEN id END AS copied_id, ${R.pipe(
        R.drop(2),
        R.join(',')
      )(columns)}
      FROM hierarchy ORDER BY parent_id asc
      RETURNING id, parent_id, copied_id;
    `;

    // * 복사된 항목 ID, PARENT_ID, COPIED_ID 반환
    const copied: any[] = await DB.$queryRaw(Prisma.sql([insert]));

    // * 복사된 항목 부모 ID로 그룹화
    const groupByParentId = copied.reduce((acc, cur: any) => {
      const { id, parent_id, copied_id } = cur;
      if (!acc[parent_id]) {
        return { ...acc, [copied_id]: [id, parent_id] };
      }
      return acc;
    }, {});

    // * 부모 ID로 변경
    const entries = Object.entries(groupByParentId);

    const result = await Promise.all(
      entries.map(async (entry) => {
        const [key, value] = entry as [string, [number, number]];
        return await DB.storage.updateMany({
          where: { parent_id: Number(key), copied_id: { gt: 0 } },
          data: { parent_id: Number(value[0]), copied_id: 0 },
        });
      })
    );

    // * COPIED_ID 초기화
    await DB.storage.updateMany({
      where: { copied_id: { gt: 0 } },
      data: { copied_id: 0 },
    });

    return result;
  }

  // * 여러 항목 삭제
  @Delete()
  async destroy(@Body(ValidationPipe) body: MultipleID) {
    const { ids } = body;

    //* 일괄삭제
    const query = `
      DELETE FROM "Storage" WHERE id IN (
        WITH RECURSIVE hierarchy AS (
          SELECT id, parent_id
          FROM "Storage"
          WHERE parent_id IN (${ids}) OR id IN (${ids})
          UNION
          SELECT s.id, s.parent_id
          FROM "Storage" s
          INNER JOIN hierarchy h ON s.parent_id = h.id
        )
        SELECT id FROM hierarchy
      );
    `;

    return await DB.$queryRaw(Prisma.sql([query]));
  }
}

export default createHandler(Handler);
