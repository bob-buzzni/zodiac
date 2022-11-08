import * as R from 'ramda';
import component from './ImageViewer';
import { exec$, action$ } from '~/store';
import { install } from '~/plugins';
import { FolderEvent } from '~/constants';

install('image-viewer', {
  icon: '/icons/image_viewer.png',
  subject: '이미지 뷰어',
  description: '이미지를 미리 볼 수 있습니다.',
  component,
});

action$.subscribe((payload) => {
  if (payload.type === FolderEvent.EXECUTE) {
    const extension = R.pipe(
      R.split('.'),
      R.last
    )(payload.data.subject) as string;
    if (['jpg', 'png', 'gif'].includes(extension)) {
      exec$.next({ app: 'image-viewer', cmd: 'start', args: payload.data });
    }
  }
});