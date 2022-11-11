import qs from 'qs';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { MouseEvent, useEffect, useState, useContext } from 'react';
import { fromFetch } from 'rxjs/fetch';
import { FolderEvent } from '~/constants';
import { action$ } from '~/store';
import { Node, transform } from '~/utils/storage';
import Toolbar from './Toolbar';
import SortableList from './SortableList';
import styles from './Folder.module.css';
import Context, { HistoryEvent, HistoryType } from './context';
type PropsType = {
  args: string[];
};

type ParamsType = Partial<{ type: string; pid: number; depth: number }>;

function Folder({ args }: PropsType) {
  const [state, setState] = useState({ loading: true });
  const [data, setData] = useState<Node[]>([]);

  const { history$ } = useContext(Context);
  const [fetch$] = useState(new Rx.Subject<ParamsType>());

  const handleClick = (node: Node, e: MouseEvent<HTMLButtonElement>) => {
    //* Single click
    if (e.detail === 1) {
      action$.next({ type: FolderEvent.SELECTED, data: node });
    }

    //* Double click
    if (e.detail === 2) {
      if (node.isDirectory()) {
        action$.next({ type: FolderEvent.ENTER, data: node });
        history$.next({ type: HistoryEvent.PUSH, args: { pid: node.id } });
      } else {
        action$.next({ type: FolderEvent.EXECUTE, data: node });
      }
    }
  };

  const handleChanged = (moved: number[]) => {
    const [acc, cur] = moved;
    const res = R.move(acc, cur, data);
    setData(() => res);
  };

  const init = () => {
    // * PID 변경시 갱신
    const subscription = fetch$
      .pipe(
        Rx.tap(() => setState({ loading: true })),
        Rx.switchMap((value) => {
          const { type, pid: parent_id, depth } = value;
          return fromFetch(
            '/api/storage' +
              qs.stringify(
                { type, parent_id, depth },
                { addQueryPrefix: true, skipNulls: true }
              )
          ).pipe(
            Rx.switchMap((res) => res.json()),
            Rx.takeUntil(Rx.timer(5e3)),
            Rx.tap((v) => {
              // * 목록 업데이트 전파
              action$.next({ type: FolderEvent.LISTING, data: v });
            }),

            // * item to Node
            Rx.map((v) => transform(v))
          );
        }),
        Rx.tap(() => setState({ loading: false }))
      )
      .subscribe(setData);

    history$.pipe(Rx.distinctUntilChanged()).subscribe((value) => {
      const { args = {} } = value;
      fetch$.next(args);
    });
    history$.next({ type: HistoryEvent.INITIAL, args: { pid: 1 } });

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      <Toolbar />
      {!state.loading ? (
        <SortableList
          items={data}
          onClick={handleClick}
          onChanged={handleChanged}
        />
      ) : null}
    </div>
  );
}

export default function FolderContext(props: PropsType) {
  const [history$] = useState(new Rx.Subject<HistoryType>());

  return (
    <Context.Provider value={{ history$ }}>
      <Folder {...props} />
    </Context.Provider>
  );
}
