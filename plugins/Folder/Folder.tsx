import qs from 'qs';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { MouseEvent, useEffect, useState, useContext } from 'react';
import { fromFetch } from 'rxjs/fetch';
import { FolderEvent, HistoryEvent } from './event';
import { action$ } from '~/store';
import { Node, transform } from '~/utils/storage';
import Toolbar from './Toolbar';
import SortableList from './SortableList';
import styles from './Folder.module.css';
import Context, { HistoryType } from './context';
import axios from 'axios';
type PropsType = {
  args: string[];
};

type ParamsType = Partial<{ type: string; pid: number; depth: number }>;
type StateType = {
  loading: boolean;
  selected: Node[];
};
function Folder({ args }: PropsType) {
  const [state, setState] = useState<StateType>({
    loading: true,
    selected: [],
  });
  const [record, setRecord] = useState<Node[]>([]);

  const { history$ } = useContext(Context);
  const [fetch$] = useState(new Rx.Subject<ParamsType>());

  const handleNodeClick = (e: MouseEvent<HTMLButtonElement>, node: Node) => {
    //* Single click
    if (e.detail === 1) {
      const selected: Node[] = !!R.count(
        (v) => v.id === node.id,
        state.selected
      )
        ? R.reject((v: Node) => v.id === node.id, state.selected)
        : R.append(node, state.selected);

      action$.next({ type: FolderEvent.SELECTED, data: selected });
    }

    //* Double click
    if (e.detail === 2) {
      // * 선택 초기화
      action$.next({ type: FolderEvent.DESELECT, data: [] });

      if (node.isDirectory()) {
        // * 디렉토리 진입 알림
        action$.next({ type: FolderEvent.ENTER, data: node });

        // * 디렉토리 이동
        history$.next({ type: HistoryEvent.PUSH, data: { pid: node.id } });
      } else {
        // * 실행
        action$.next({ type: FolderEvent.EXECUTE, data: node });
      }
    }
  };

  const handleChanged = (moved: number[]) => {
    const [acc, cur] = moved;
    const res = R.move(acc, cur, record);
    axios.put(`/api/storage/seq`, { ids: res.map((v) => v.id) });
    setRecord(() => res);
  };

  //* 빈공간 클릭
  const handleClick = () => {
    // * 선택 초기화
    action$.next({ type: FolderEvent.DESELECT, data: [] });
  };

  const init = () => {
    // * PID 변경시 갱신
    const subscription = fetch$
      .pipe(
        Rx.tap(() => setState((state) => ({ ...state, loading: true }))),
        Rx.switchMap((value) => {
          const { pid } = value;
          return fromFetch(`/api/storage/${pid}`).pipe(
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
        Rx.tap(() => setState((state) => ({ ...state, loading: false })))
      )
      .subscribe(setRecord);

    history$.pipe(Rx.distinctUntilChanged()).subscribe((value) => {
      const { data = {} } = value;
      fetch$.next(data);
    });

    subscription.add(
      action$
        .pipe(
          Rx.filter(
            (value) =>
              value.type === FolderEvent.DESELECT ||
              value.type === FolderEvent.SELECTED
          ),
          Rx.debounceTime(120)
        )
        .subscribe((value) => {
          setState((state) => ({
            ...state,
            selected: value.type === FolderEvent.SELECTED ? value.data : [],
          }));
        })
    );

    history$.next({ type: HistoryEvent.INITIAL, data: { pid: 1 } });
    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <div className={styles.container} onClick={handleClick}>
      <Toolbar />
      {!state.loading ? (
        <SortableList
          items={record}
          onClick={handleNodeClick}
          onChanged={handleChanged}
        />
      ) : (
        <span></span>
      )}
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
