import { install } from '~/plugins';
import component from './Folder';

install('folder', {
  icon: 'fa-solid fa-folder-open',
  color: '#BC3717',
  subject: '폴더',
  description: '문서, 미디어, 디렉토리, 파일을 찾거나 생성 할 수 있습니다.',
  component,
});
