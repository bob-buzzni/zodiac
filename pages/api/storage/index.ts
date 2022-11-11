import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  createHandler,
  Get,
  HttpCode,
  Post,
  Req,
  Body,
  ValidationPipe,
  Delete,
} from 'next-api-decorators';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import list from './list';
import * as R from 'ramda';
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

class DestroyFromId {
  @IsNotEmpty()
  ids: string[];
}

class Handler {
  @Get()
  async index(@Req() req: NextApiRequest) {
    const { depth, type, parent_id } = req.query;

    const result = await list({ depth, parent_id, type } as any);
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

  @Delete()
  async destroy(@Body(ValidationPipe) body: DestroyFromId) {
    const { ids } = body;
    const children = await Promise.all(
      ids.map((id) => {
        return list({ depth: 999, parent_id: Number(id) } as any);
      })
    );

    const items = R.pipe(
      R.flatten,
      R.map((child) => child.id),
      R.concat(ids)
    )(children);

    const result = await DB.storage.deleteMany({
      where: { id: { in: items } },
    });
    return result;
  }
}

export default createHandler(Handler);
