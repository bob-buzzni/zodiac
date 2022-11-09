import qs from 'qs';
import * as R from 'ramda';
import { MouseEvent, useEffect, useState, useContext } from 'react';
import * as Rx from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { FolderEvent } from '~/constants';
import { action$ } from '~/store';
import { Node, transform } from '~/utils/storage';
import Toolbar from './Toolbar';
import SortableList from './SortableList';
import styles from './Folder.module.css';
import Context, { HistoryType } from './context';
type PropsType = {
  args: string[];
};

type ParamsType = Partial<{ type: string; pid: number; depth: number }>;

function Folder({ args }: PropsType) {
  const [data, setData] = useState<Node[]>([]);

  const { history$ } = useContext(Context);
  const [fetch$] = useState(new Rx.Subject<ParamsType>());

  const handleClick = (node: Node, e: MouseEvent<HTMLButtonElement>) => {
    //* Double click
    if (e.detail === 2) {
      if (node.isDirectory()) {
        // fetch$.next({ pid: node.id });
        history$.next({ action: 'push', args: { pid: node.id } });
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
    const subscription = fetch$
      .pipe(
        Rx.switchMap((value) => {
          const { type, pid: parent_id, depth } = value;
          return fromFetch(
            '/api/storage/list?' +
              qs.stringify({ type, parent_id, depth }, { skipNulls: true })
          ).pipe(
            Rx.switchMap((res) => res.json()),
            Rx.takeUntil(Rx.timer(5e3)),
            Rx.tap((v) => {
              action$.next({ type: FolderEvent.LISTING, data: v });
            }),
            Rx.map((v) => transform(v))
          );
        })
      )
      .subscribe(setData);

    history$.pipe(Rx.distinctUntilChanged()).subscribe((value) => {
      const { args } = value;
      fetch$.next(args);
    });
    history$.next({ action: 'initial', args: { pid: 1 } });

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);
  return (
    <div className={styles.container}>
      <Toolbar />
      <SortableList
        items={data}
        onClick={handleClick}
        onChanged={handleChanged}
      />
    </div>
  );
}

type ArgType = {
  pid: number;
};

export default function FolderContext(props: PropsType) {
  const [history$] = useState(new Rx.Subject<HistoryType<ArgType>>());

  return (
    <Context.Provider value={{ history$ }}>
      <Folder {...props} />
    </Context.Provider>
  );
}
