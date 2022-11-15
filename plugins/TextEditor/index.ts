import * as R from 'ramda';
import component from './TextEditor';
import { exec$, action$ } from '~/store';
import { install } from '~/plugins';
import { FolderEvent } from '../Folder/event';

install('text-editor', {
  icon: '/icons/file.png',
  subject: '텍스트 편집기',
  description: '파일의 내용을 편집 할 수 있습니다.',
  component,
});

action$.subscribe((payload) => {
  if (payload.type === FolderEvent.EXECUTE) {
    const extension = R.pipe(
      R.split('.'),
      R.last
    )(payload.data.name) as string;
    if (['txt'].includes(extension)) {
      exec$.next({ app: 'text-editor', cmd: 'start', args: payload.data });
    }
  }
});
