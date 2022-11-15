import * as R from 'ramda';
import component from './ImageViewer';
import { exec$, action$ } from '~/store';
import { install } from '~/plugins';
import { FolderEvent } from '../Folder/event';

install('image-viewer', {
  icon: '/icons/picture.png',
  subject: '이미지 뷰어',
  description: '이미지를 미리 볼 수 있습니다.',
  component,
});

action$.subscribe((payload) => {
  if (payload.type === FolderEvent.EXECUTE) {
    const extension = R.pipe(
      R.split('.'),
      R.last
    )(payload.data.name) as string;
    if (['jpg', 'png', 'gif'].includes(extension)) {
      exec$.next({ app: 'image-viewer', cmd: 'start', args: payload.data });
    }
  }
});
