import { install } from '~/plugins';
import component from './Folder';

install('folder', {
  icon: '/icons/folder.png',
  subject: '폴더',
  description: '문서, 미디어, 디렉토리, 파일을 찾거나 생성 할 수 있습니다.',
  component,
});
