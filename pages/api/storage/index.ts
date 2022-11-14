import { Prisma, PrismaClient } from '@prisma/client';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import type { NextApiRequest } from 'next';
import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  ValidationPipe,
} from 'next-api-decorators';

const DB = new PrismaClient();

class DestroyFromId {
  @IsNotEmpty()
  ids: string[];
}

class Handler {

  // * 여러 항목 삭제
  @Delete()
  async destroy(@Body(ValidationPipe) body: DestroyFromId) {
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
