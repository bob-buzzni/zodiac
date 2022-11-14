import { useEffect, useState, useContext, KeyboardEvent } from 'react';
import * as Rx from 'rxjs';
import axios from 'axios';
import styles from './Crud.module.css';
import { FolderEvent, HistoryEvent } from '../../event';
import { Node, createNode } from '~/utils/storage';
import Context from '../../context';
import { action$ } from '~/store';
type PropsType = {};

function Crud({}: PropsType) {
  const [state, setState] = useState<{ pid: number; selected: Node[] }>({
    pid: -1,
    selected: [],
  });
  const { history$ } = useContext(Context);

  const create = (params: {
    subject: string;
    parent_id: number;
    type: 'file' | 'directory';
  }) => {
    axios
      .post(`/api/storage/${state.pid}`, {
        type: 'directory',
        subject: '무제',
      })
      .then((res) => res.data)
      .then((res) => {
        action$.next({ type: FolderEvent.ADDED, data: createNode(res) });
        history$.next({ type: HistoryEvent.RELOAD, data: { pid: state.pid } });
      });
  };

  // * 디렉토리 생성
  const handleCreateDirectory = () => {
    create({ parent_id: state.pid, type: 'directory', subject: '무제' });
  };

  // * 파일 생성
  const handleCreateFile = () => {
    create({ parent_id: state.pid, type: 'file', subject: '무제.txt' });
  };

  // * 선택된 항목 전체 복사
  const handleCopy = () => {};

  // * 선택된 단일 항목 이름 변경
  const handleRename = () => {
    // * 첫번째 항목만 변경
    const [item] = state.selected;
    const subject = prompt('이름 변경');
    if (subject) {
      axios.put(`/api/storage/${item.id}`, { subject }).then(() => {
        history$.next({ type: HistoryEvent.RELOAD, data: { pid: state.pid } });
      });
    }
  };

  // * 선택된 항목 전부 삭제
  const handleDestroy = () => {
    const ids = state.selected.map((node) => node.id);

    // * 일괄 삭제
    axios.delete('/api/storage', { data: { ids } }).then((_) => {
      // * 삭제 항목 알림
      action$.next({ type: FolderEvent.REMOVED, data: state.selected });

      // * 디렉토리 새로고침
      history$.next({ type: HistoryEvent.RELOAD, data: { pid: state.pid } });
    });
  };

  const init = () => {
    const subscription = new Rx.Subscription();

    // * 마지막 PID
    const lastState$ = history$
      .pipe(Rx.map((value) => value.data as { pid: number }))
      .subscribe((value) => setState((state) => ({ ...state, ...value })));

    subscription.add(lastState$);

    // * 선택 항목
    const selected$ = action$
      .pipe(
        Rx.filter(
          // * 선택된 항목이 있거나, 전체 해제 인 경우
          (value) =>
            value.type === FolderEvent.SELECTED ||
            value.type === FolderEvent.DESELECT
        ),
        Rx.debounceTime(120)
      )
      .subscribe((value) => {
        setState((state) => ({
          ...state,

          // * 선택된 항목 동기화
          selected: value.type === FolderEvent.SELECTED ? value.data : [],
        }));
      });
    subscription.add(selected$);

    // * ENTER
    const enter$ = Rx.fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(Rx.map((v) => v.key.toUpperCase()))
      .subscribe((value) => {
        // * 항목 삭제
        if (value === 'BACKSPACE' && state.selected.length > 0) {
          handleDestroy();
        }

        // * 항목 이름 변경
        if (value === 'ENTER' && state.selected.length === 1) {
          handleRename();
        }
      });

    subscription.add(enter$);

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, [state.selected]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={handleCreateDirectory}
        disabled={state.selected.length > 0}
      >
        디렉토리 생성
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleCreateFile}
        disabled={state.selected.length > 0}
      >
        파일 생성
      </button>
      <button
        type="button"
        className={styles.button}
        disabled={state.selected.length === 0}
        onClick={handleCopy}
      >
        복사
      </button>
      <button
        type="button"
        className={styles.button}
        disabled={state.selected.length > 1 || state.selected.length === 0}
        onClick={handleRename}
      >
        이름 변경
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleDestroy}
        disabled={state.selected.length === 0}
      >
        삭제
      </button>
    </div>
  );
}

export default Crud;
