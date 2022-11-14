import { Prisma, PrismaClient } from '@prisma/client';
import * as R from 'ramda';

const DB = new PrismaClient();

import {
  Body,
  createHandler,
  Delete,
  Get,
  Post,
  Put,
  Req,
  HttpCode,
  ValidationPipe,
} from 'next-api-decorators';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import type { NextApiRequest } from 'next';

class Field {
  parent_id: number;
  subject: string;
  description: string;
  content: string;
  tags: string;
  thumbnail: string;
}
class Storage {
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
    const { id } = req.query;
    const query = `
      WITH RECURSIVE hierarchy AS (
        SELECT id, parent_id, type, author_id, thumbnail, subject, description, content, tags, created_at, updated_at, 0 as depth
        FROM "Storage"
        WHERE parent_id = ${id}
        UNION
          SELECT s.id, s.parent_id, s.type, s.author_id, s.thumbnail, s.subject, s.description, s.content, s.tags, s.created_at, s.updated_at, t.depth + 1
          FROM "Storage" s
          INNER JOIN hierarchy t ON s.parent_id = t.id
      )
      SELECT *
      FROM hierarchy
      WHERE depth = 0
    `;

    return await DB.$queryRaw(Prisma.sql([query]));
  }

  @Post()
  @HttpCode(201)
  async store(@Req() req: NextApiRequest, @Body(ValidationPipe) body: Storage) {
    const { id } = req.query;
    return DB.storage.create({
      data: {
        ...body,
        parent_id: Number(id),
        author_id: 1,
      },
    });
  }

  @Put()
  async update(@Req() req: NextApiRequest, @Body(ValidationPipe) body: Field) {
    const { id } = req.query;
    const params = R.pick(['parent_id', 'subject'], body);
    const data = params;
    return await DB.storage.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }

  @Delete()
  async destroy(@Req() req: NextApiRequest) {
    const { id } = req.query;
    const query = `
      DELETE FROM "Storage" WHERE id IN (
        WITH RECURSIVE hierarchy AS (
          SELECT id, parent_id
          FROM "Storage"
          WHERE parent_id = (${id}) OR id = (${id})
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
