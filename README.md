# Zodiac

개발자를 위한 사용자화 백오피스 프레임워크.

대부분 많은 백오피스들은 정적데이터를 활용한 서비스 페이지가 많습니다.

요구사항에 따라 만드는 백오피스는 적지 않은 리소스가 발생하여, 백오피스 마다 사용법이 달라 이후에 유지 보수 및 인계에도 문제가 생기기도 합니다.

'Zodiac' 이 풀고자 하는 문제는 다음 2가지 입니다.

- 비개발자들도 따로 사용법을 익히지 않고 쉽게 사용 할 수 있어야 하며,
- 매번 다른 방법으로 개발하지 않고, 정적 데이터를 구조화

위 2가지 모두를 충족할 수 있는 기존 플랫폼으로는 윈도우 탐색기 또는 맥의 Finder 라고 생각합니다.

'Zodiac'은 탐색기와 비슷한 인터페이스로 요구사항에 맞는 모듈을 만들어 가급적 재사용 할 수 있도록 도와 줍니다.

## TODO

- [x] 윈도우의 드래그 및 크기 재조정  
- [x] 플러그인 등록 설계  
- [x] 확장자별 플러그인 구분 실행 이벤트  
- [x] 선택한 항목 삭제  
- [x] 디렉토리 생성  
- [x] 파일 생성  
- [ ] 복사 (개발중)
- [x] 아미지 뷰어  
- [ ] 텍스트 뷰어  
- [ ] 이미지 업로드  
- [ ] 파일 순서 변경  
- [ ] 마우스 드래그로 항목 선택  
- [ ] 권한 설정

## START

- setup postgresql in `.env`
- yarn
- npx prisma db push
- npx prisma db seed // 샘플 데이터 필요시

## Stack

- NextJS 13 (beta)
- Rxjs
- Ramda
- Prisma
- Postgresql

## Schema

### Storage

| key         | type     | default | description               |
| ----------- | -------- | ------- | ------------------------- |
| id          | number   | -       | Primary key               |
| type        | string   | file    | directory, file, symbolic |
| status      | string   | public  | -                         |
| parent_id   | number   | -       | Parent id                 |
| thumbnail   | string   | -       | -                         |
| subject     | string   | -       | -                         |
| description | string   | -       | -                         |
| content     | string   | -       | file contents             |
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
