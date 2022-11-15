import "./global.css";
import axios from 'axios';
import * as R from 'ramda';
import { install } from '~/plugins';
import { action$ } from '~/store';
import { FolderEvent } from '../Folder/event';
install('link', {
  icon: '/icons/linked.png',
  subject: '바로가기',
  description: '외부사이트로 이동 할 수 있습니다.',
});

action$.subscribe((payload) => {
  if (payload.type === FolderEvent.EXECUTE) {
    const extension = R.pipe(R.split('.'), R.last)(payload.data.name) as string;
    if (['link'].includes(extension)) {
      const { data } = payload;
      axios
        .get(`/api/storage/${data.id}`)
        .then((res) => res.data)
        .then((data) => {
          const { content } = data;
          window.open(content);
        });
    }
  }
});
