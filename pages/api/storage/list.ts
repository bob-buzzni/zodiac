import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
const DB = new PrismaClient();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { depth = 1, type, parent_id = 1 } = req.query;

  const sql = Prisma.sql`
    WITH RECURSIVE tree AS (
      SELECT id, parent_id, type, author_id, thumbnail, subject, description, content, tags, created_at, updated_at, 0 as depth
      FROM "Storage"
      WHERE parent_id = ${Number(parent_id)}
      UNION
        SELECT s.id, s.parent_id, s.type, s.author_id, s.thumbnail, s.subject, s.description, s.content, s.tags, s.created_at, s.updated_at, t.depth + 1
        FROM "Storage" s
        INNER JOIN tree t ON s.parent_id = t.id
    )
    SELECT *
    FROM tree
    WHERE depth < ${Number(depth)}
  `;

  //* type 구분
  const result = await (!!type
    ? DB.$queryRaw`${sql} AND "type" = ${type};`
    : DB.$queryRaw`${sql};`);

  res.status(200).json(result);
};
