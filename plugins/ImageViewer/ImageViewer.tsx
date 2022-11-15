import { useEffect, useState } from 'react';
import * as Rx from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Node } from '~/utils/storage';
import styles from './ImageViewer.module.css';
import './global.css';
type ImageType = {
  url: string;
  width: number;
  height: number;
};

function ImageViewer({ args }: any) {
  const node = args as Node;
  const [content, setContent] = useState<Partial<ImageType>>({});

  const init = () => {
    const subscription = new Rx.Subscription();
    subscription.add(
      fromFetch(`/api/storage/${node.id}`, {
        selector: (response) => response.json(),
      })
        .pipe(Rx.map((value) => value.content))
        .subscribe((value) => {
          try {
            let data = JSON.parse(value);
            setContent(data);
          } catch (e) {
            alert('파일 형식이 잘못 되었습니다.');
          }
        })
    );
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      <img src={content.url} alt="" />
    </div>
  );
}

export default ImageViewer;
