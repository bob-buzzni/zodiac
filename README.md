# Zoniac

개발자를 위한 사용자화 백오피스 프레임워크

## START
- setup postgresql in  `.env` 
- yarn
- npx prisma db push
- npx prisma db seed // 샘플 데이터 필요시

## Stack
- NextJS 13 (beta)
- Rxjs
- Ramda
- Prisma
- Postgresql

## Components
- window
- desktop
- taskbar
- folder
- html editor
- text editor
- cpid
- pdid

## Schema
### Storage
| key         | type     | default | description               |
| ----------- | -------- | ------- | ------------------------- |
| id          | number   | -       | Primary key               |
| type        | string   | file    | directory, file, symbolic |
| parent_id   | number   | -       | Parent id                 |
| thumbnail   | string   | -       | -                         |
| subject     | string   | -       | -                         |
| description | string   | -       | -                         |
| content     | string   | -       | -                         |
| tags        | string   | -       | -                         |
| author_id   | number   | -       | user id                   |
| created_at  | datetime | -       | -                         |
| updated_at  | datetime | -       | -                         |

### User
| key        | type     | default | description |
| ---------- | -------- | ------- | ----------- |
| id         | number   | -       | Primary key |
| email      | string   | -       | -           |
| created_at | datetime | -       | -           |
| updated_at | datetime | -       | -           |