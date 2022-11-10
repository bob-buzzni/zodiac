import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { createHandler, Get, HttpCode, Post, Req, Body, ValidationPipe } from 'next-api-decorators';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
const DB = new PrismaClient();

class Storage {
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['file', 'directory'])
  type: string;

  @IsNotEmpty()
  subject: string;

  description: string = '';
  content: string = '';
  tags: string = '';
  thumbnail: string = '';
}

class Handler {
  @Get()
  async index(@Req() req: NextApiRequest) {
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

    return result;
  }

    @Post()
    @HttpCode(201)
    async store(@Body(ValidationPipe) body: Storage) {
      const { ...data } = body;
      return DB.storage.create({
        data: {
          ...data,
          author_id: 1,
        },
      });
    }
}

export default createHandler(Handler);
