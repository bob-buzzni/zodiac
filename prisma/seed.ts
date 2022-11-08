import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
async function main() {
  await client.user.upsert({
    where: {
      email: 'uznam8x@gmail.com',
    },
    update: {},
    create: {
      email: 'uznam8x@gmail.com',
      role: 'super',
    },
  });

  const record = [
    [1, 'directory', 0, '', 'root', '', '', '', 1],
    [2, 'directory', 1, '', '데스크톱', '', '', '', 1],
    [3, 'file', 2, '', 'cover.jpg', '', '{"url":"https://cdn.pixabay.com/photo/2022/10/19/01/18/cherry-blossom-7531346_1280.jpg","width":853,"height":1280}', '', 1],
    [4, 'directory', 2, '', '다운로드', '다운로드 파일', '', '', 1],
    [5, 'directory', 2, '', '날짜별', '날짜별 데이터', '', '', 1],
    [6, 'directory', 5, '', '10/16(일)', '', '', '', 1],
    [7, 'directory', 5, '', '10/15(토)', '', '', '', 1],
    [8, 'directory', 5, '', '10/14(금)', '', '', '', 1],
    [9, 'file', 5, '', 'cover.jpg', '', '{"url":"https://cdn.pixabay.com/photo/2022/10/19/01/18/cherry-blossom-7531346_1280.jpg","width":853,"height":1280}', '', 1],
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
  });
