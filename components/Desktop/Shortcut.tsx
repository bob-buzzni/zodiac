import { MouseEvent, useEffect } from 'react';
import { getPlugin } from '~/plugins';
import { exec$ } from '~/store';
import styles from './Shortcut.module.css';
import Image from 'next/image';
export default function Shortcut() {
  const FOLDER = getPlugin('folder');

  const handleClick = (key: string, e: MouseEvent<HTMLButtonElement>) => {
    //* Double click
    if (e.detail === 2) {
      exec$.next({ app: key, cmd: 'start', args: [] });
    }
  };

  const init = () => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        exec$.next({ app: 'folder', cmd: 'start', args: [] });
      }, 500);
    }
  };
  useEffect(init, []);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick.bind(null, 'folder')}
      >
        <Image
          src={FOLDER!.icon}
          alt={FOLDER!.subject}
          width={48}
          height={48}
        />
        <span>{FOLDER!.subject}</span>
      </button>
      <a
        href="https://github.com/uznam8x/zodiac"
        target="_blank"
        type="button"
        className={styles.button}
      >
        <img
          src={'https://github.com/favicon.ico'}
          alt={'github'}
          width={48}
          height={48}
        />
        <span>GITHUB</span>
      </a>
    </div>
  );
}
