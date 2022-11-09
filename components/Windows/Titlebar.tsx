import clsx from 'clsx';
import { getPlugin } from '../../plugins';
import { exec$, ExecType } from '../../store';
import styles from './Titlebar.module.css';
type PropsType = {
  exec: ExecType;
  className?: string;
};

function Titlebar({ exec, className = '' }: PropsType) {
  const handleMaximum = () => {};
  const handleMinimum = () => {};
  const handleClose = () => {
    exec$.next({ id: exec.id, cmd: 'stop' });
  };

  const plugin = getPlugin(exec.app);
  return (
    <div className={clsx('titlebar', styles.container)}>
      <label className={styles.label}>
        <i className={plugin!.icon} style={{color: plugin!.color}}></i>
        <span>{plugin!.subject}</span>
      </label>
      <span className={styles.space} />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
        ></button>
        <button
          type="button"
          className={styles.minimum}
          onClick={handleMinimum}
        ></button>
        <button
          type="button"
          className={styles.maximum}
          onClick={handleMaximum}
        ></button>
      </div>
    </div>
  );
}

export default Titlebar;
