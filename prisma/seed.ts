import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
async function main() {
  await client.user.upsert({
    where: {
      email: 'bob@buzzni.com',
    },
    update: {},
    create: {
      email: 'bob@buzzni.com',
      role: 'super',
    },
  });

  const record = [
    [1, 'directory', 0, '', 'root', '', '', '', 1],
    [2, 'directory', 1, '', '홈쇼핑대전', '', '', '', 1],
    [3, 'file', 2, '', 'cover.jpg', '', 'url=//a.com,mimetype=jpg,width=32,height=32', '', 1],
    [4, 'directory', 2, '', '홈쇼핑 베스트 상품', '10월 홈쇼핑 대전 인기상품', '', '', 1],
    [5, 'directory', 2, '', '단 3일 홈쇼핑모아에서만', '10월 홈쇼핑 대전 추천방송', '', '', 1],
    [6, 'directory', 5, '', '10/16(일)', '', '', '', 1],
    [7, 'directory', 5, '', '10/15(토)', '', '', '', 1],
    [8, 'directory', 5, '', '10/14(금)', '', '', '', 1],
    [9, 'file', 5, '', 'cover.jpg', '', '', '', 1],
  ];

  for (const item of record) {
    const [id, type, parent_id, thumbnail, subject, description, content, tags, author_id] = item as any;

    await client.storage.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        type,
        parent_id,
        thumbnail,
        subject,
        description,
        content,
        tags,
        author_id,
      },
    });
  }
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
