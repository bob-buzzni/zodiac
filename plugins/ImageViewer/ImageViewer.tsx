import { useEffect, useState } from 'react';
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
    try {
      let data = JSON.parse(node.content);
      setContent(data);
    } catch (e) {}
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      <img src={content.url} alt="" />
    </div>
  );
}

export default ImageViewer;
