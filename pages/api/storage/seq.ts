import { Prisma, PrismaClient } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import {
  Body,
  createHandler,
  Put,
  Delete,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import * as R from 'ramda';
const DB = new PrismaClient();

class MultipleID {
  @IsNotEmpty()
  ids: string[];
}

class Handler {
  @Put()
  async index(@Body(ValidationPipe) body: MultipleID) {
    const { ids } = body;

    const res = await Promise.all(
      ids.map((id, i) => {
        return DB.storage.update({
          where: { id: Number(id) },
          data: { seq: i },
        });
      })
    );
    return res;
  }
}
export default createHandler(Handler);
