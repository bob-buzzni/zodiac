import clsx from 'clsx';
import * as R from 'ramda';
import { useEffect, useState } from 'react';
import * as Rx from 'rxjs';
import { WindowEvent } from '~/constants';
import { getPlugin } from '~/plugins';
import { action$, exec$, ExecType, task$ } from '~/store';
import styles from './Taskbar.module.css';
import Image from 'next/image';
export default function Taskbar() {
  const [items, setItems] = useState<ExecType[]>([]);
  const [state, setState] = useState({ activate: '' });

  const handleClick = (id: string) => {
    action$.next({ type: WindowEvent.ACTIVATE, data: [id] });
  };

  const init = () => {
    const subscription = new Rx.Subscription();
    const task = exec$
      .pipe(
        Rx.scan((acc: ExecType[], cur) => {
          //* 등록
          if (cur.cmd === 'start') {
            return R.append(cur, acc);
          }

          //* 삭제
          if (cur.cmd === 'stop') {
            return R.reject((job: ExecType) => job.id === cur.id, acc);
          }

          //* 실행 하지 않음
          return acc;
        }, []),
        Rx.tap((value) => task$.next(value))
      )
      .subscribe(setItems);

    subscription.add(task);

    const action = action$
      .pipe(
        Rx.filter((value) => value.type === WindowEvent.ACTIVATE),
        Rx.map((value) => value.data[0] /* id */)
      )
      .subscribe((value) => {
        setState(() => ({ activate: value }));
      });

    subscription.add(action);
    return () => {
      subscription.unsubscribe();
    };
  };

  useEffect(init, []);
  return (
    <aside className={styles.container}>
      {items.map((v) => {
        const info = getPlugin(v.app);

        return info ? (
          <button
            className={clsx(
              styles.button,
              v.id === state.activate && styles.active
            )}
            type="button"
            key={v.id}
            title={info.description}
            onClick={handleClick.bind(null, v.id)}
          >
            <Image src={info.icon} alt={info.subject} width={32} height={32} />
          </button>
        ) : null;
      })}
    </aside>
  );
}
