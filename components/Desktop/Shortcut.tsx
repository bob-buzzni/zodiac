import { MouseEvent, useEffect } from 'react';
import { getPlugin } from '~/plugins';
import { exec$ } from '~/store';
import styles from './Shortcut.module.css';
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
        <i className={FOLDER!.icon} style={{ color: FOLDER!.color }}></i>
        <span>{FOLDER!.subject}</span>
      </button>
    </div>
  );
}
