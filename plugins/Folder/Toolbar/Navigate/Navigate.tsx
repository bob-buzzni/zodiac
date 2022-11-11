import styles from './Navigate.module.css';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { useContext, useState, useEffect } from 'react';
import { HistoryEvent } from '../../event';
import Context, { HistoryType } from '../../context';
type PropsType = {};

type StackType<T> = {
  prev: T[];
  curr: T;
  next: T[];
  type: HistoryType['type'];
};

function Navigate({}: PropsType) {
  const [state, setState] = useState({ isPrevable: false, isNextable: false });
  const { history$ } = useContext(Context);

  const [navigate$] = useState(new Rx.Subject<HistoryType>());
  const handleClick = (type: HistoryType['type']) => {
    navigate$.next({ type, data: {} });
  };

  const init = () => {
    const subscription = new Rx.Subscription();
    const stack$ = navigate$
      .pipe(
        Rx.scan(
          (acc, cur) => {
            const { prev, curr, next } = acc;
            const { type } = cur;
            // 초기화
            if (cur.type === HistoryEvent.INITIAL) {
              return { next: [], prev: [], curr: cur.data, type };
            }

            if (cur.type === HistoryEvent.FORWARD) {
              return {
                next: R.drop(1, next),
                prev: R.append(curr, prev),
                curr: R.head(next),
                type,
              };
            }
            if (cur.type === HistoryEvent.BACKWARD) {
              return {
                next: R.prepend(curr, next),
                prev: R.dropLast(1, prev),
                curr: R.last(prev),
                type,
              };
            }
            if (cur.type === HistoryEvent.PUSH) {
              return {
                next: [],
                prev: R.append(curr, prev),
                curr: cur.data,
                type,
              };
            }

            return acc;
          },
          {
            prev: [],
            curr: {},
            next: [],
            type: HistoryEvent.INITIAL,
          } as StackType<any>
        ),

        //* history update
        Rx.tap((value) => {
          const { type, curr: data } = value;
          if (type === HistoryEvent.BACKWARD || type === HistoryEvent.FORWARD) {
            history$.next({ type, data });
          }
        })
      )
      .subscribe((value) => {
        setState({
          isPrevable: !!value.prev.length,
          isNextable: !!value.next.length,
        });
      });

    history$.subscribe((value) => {
      const { type } = value;
      if (type === HistoryEvent.PUSH || type === HistoryEvent.INITIAL) {
        navigate$.next(value);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick.bind(null, HistoryEvent.BACKWARD)}
        disabled={!state.isPrevable}
      >
        <i className="fa-solid fa-arrow-left" />
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick.bind(null, HistoryEvent.FORWARD)}
        disabled={!state.isNextable}
      >
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
}

export default Navigate;
