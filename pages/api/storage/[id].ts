import { PrismaClient } from '@prisma/client';
import * as R from 'ramda';
const DB = new PrismaClient();

import {
  Body,
  createHandler,
  Delete,
  Get, Put,
  Req,
  ValidationPipe
} from 'next-api-decorators';

import { NextApiRequest } from 'next';

class Field {
  parent_id: number;
  subject: string;
  description: string;
  content: string;
  tags: string;
  thumbnail: string;
}

class Handler {
  @Get()
  async index(@Req() req: NextApiRequest) {
    const { id } = req.query;
    return await DB.storage.findMany({ where: { id: Number(id) } });
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

    return await DB.storage.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

export default createHandler(Handler);
