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
    [1, 'directory', 'public', 0, 0, '', 'root', '', '', '', 1],
    [2, 'directory', 'public', 0, 1, '', '데스크톱', '', '', '', 1],
    [3, 'file', 'public', 0, 1, '', '텍스트.txt', '', '안녕하세요.', '', 1],
    [4, 'file', 'public', 0, 1, '', 'sample.jpg', '', '{"url":"https://cdn.pixabay.com/photo/2022/10/19/01/18/cherry-blossom-7531346_1280.jpg","width":853,"height":1280}', '', 1],
    [5, 'directory', 'public', 0, 2, '', '다운로드', '다운로드 파일', '', '', 1],
    [6, 'directory', 'public', 0, 2, '', '날짜별', '날짜별 데이터', '', '', 1],
    [7, 'directory', 'public', 0, 5, '', '10/16(일)', '', '', '', 1],
    [8, 'directory', 'public', 0, 5, '', '10/15(토)', '', '', '', 1],
    [9, 'directory', 'public', 0, 5, '', '10/14(금)', '', '', '', 1],
    [10, 'file','public', 0, 5, '', 'cover.jpg', '', '{"url":"https://cdn.pixabay.com/photo/2022/10/19/01/18/cherry-blossom-7531346_1280.jpg","width":853,"height":1280}', '', 1],
  ];

  for (const item of record) {
    const [id, type, status, copied_id, parent_id, thumbnail, name, description, content, tags, author_id] = item as any;

    await client.storage.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        type,
        parent_id,
        copied_id,
        status,
        thumbnail,
        name,
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
