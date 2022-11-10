import styles from './Navigate.module.css';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { useContext, useState, useEffect } from 'react';
import Context, { HistoryType } from '../../context';
type PropsType = {};

type StackType<T> = {
  prev: T[];
  curr: T;
  next: T[];
  action: HistoryType['action'];
};

function Navigate({}: PropsType) {
  const [state, setState] = useState({ isPrevable: false, isNextable: false });
  const { history$ } = useContext(Context);

  const [navigate$] = useState(new Rx.Subject<HistoryType>());
  const handleClick = (action: HistoryType['action']) => {
    navigate$.next({ action, args: {} });
  };

  const init = () => {
    const subscription = new Rx.Subscription();
    const stack$ = navigate$
      .pipe(
        Rx.scan(
          (acc, cur) => {
            const { prev, curr, next } = acc;
            const { action } = cur;
            // 초기화
            if (cur.action === 'initial') {
              return { next: [], prev: [], curr: cur.args, action };
            }

            if (cur.action === 'forward') {
              return {
                next: R.drop(1, next),
                prev: R.append(curr, prev),
                curr: R.head(next),
                action,
              };
            }
            if (cur.action === 'backward') {
              return {
                next: R.prepend(curr, next),
                prev: R.dropLast(1, prev),
                curr: R.last(prev),
                action,
              };
            }
            if (cur.action === 'push') {
              return {
                next: [],
                prev: R.append(curr, prev),
                curr: cur.args,
                action,
              };
            }

            return acc;
          },
          {
            prev: [],
            curr: {},
            next: [],
            action: 'initial',
          } as StackType<any>
        ),

        //* history update
        Rx.tap((value) => {
          const { action, curr: args } = value;
          if (['backward', 'forward'].includes(action)) {
            history$.next({ action, args });
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
      const { action } = value;
      if (['push', 'initial'].includes(action)) {
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
        onClick={handleClick.bind(null, 'backward')}
        disabled={!state.isPrevable}
      >
        <i className="fa-solid fa-arrow-left" />
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick.bind(null, 'forward')}
        disabled={!state.isNextable}
      >
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
}

export default Navigate;
