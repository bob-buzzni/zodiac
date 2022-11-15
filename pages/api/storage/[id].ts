import { Prisma, PrismaClient } from '@prisma/client';
import * as R from 'ramda';

const DB = new PrismaClient();

import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { NextApiRequest } from 'next';
import {
  Body,
  createHandler,
  Delete,
  Get, HttpCode, Post,
  Put,
  Req, ValidationPipe
} from 'next-api-decorators';

class Field {
  parent_id: number;
  name: string;
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
  name: string;

  description: string = '';
  content: string = '';
  tags: string = '';
  thumbnail: string = '';
}
class Handler {
  @Get()
  async index(@Req() req: NextApiRequest) {
    const { id } = req.query;

    const row: any = await DB.storage.findUnique({ where: { id: Number(id) } });

    if (row.type === 'directory') {

      const columns = ['id', 'parent_id', 'type', 'seq', 'author_id', 'thumbnail', 'name', 'description', 'tags', 'created_at', 'updated_at'];
      const query = `
      WITH RECURSIVE hierarchy AS (
        SELECT ${columns.join(',')}, 0 as depth
        FROM "Storage"
        WHERE parent_id = ${id}
        UNION
          SELECT ${R.pipe(R.map(v => `s.${v}`),R.join(','))(columns)}, h.depth + 1
          FROM "Storage" s
          INNER JOIN hierarchy h ON s.parent_id = h.id
      )
      SELECT ${columns.join(',')} FROM hierarchy WHERE depth = 0;
    `;

      return await DB.$queryRaw(Prisma.sql([query]));
    }
    
    return row;
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
    const params = R.pick(
      ['parent_id', 'name', 'content', 'tags', 'thumbnail'],
      body
    );
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
