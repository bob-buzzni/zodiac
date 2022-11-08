import styles from './Window.module.css';
import clsx from 'clsx';
import * as R from 'ramda';
import { ReactNode, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import * as Rx from 'rxjs';
import { WindowEvent } from '../../constants';
import { action$, ExecType } from '../../store';
import Titlebar from './Titlebar';
import Viewport from './Viewport';

type PropsType = {
  exec: ExecType;
  children: ReactNode;
};
type SizeType = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const initialBound = { x: 0, y: 0, width: 480, height: 320 };
const sessionState = '__FOLDER_STATE__';

const getBound = () => {
  return JSON.parse(
    window.sessionStorage.getItem(sessionState) ?? JSON.stringify(initialBound)
  ) as SizeType;
};
const setBound = (size: Partial<SizeType>) => {
  window.sessionStorage.setItem(sessionState, JSON.stringify(R.mergeDeepLeft(size, getBound())));
};

export default function Window({ exec, children }: PropsType) {
  const [state, setState] = useState({ active: false });

  const [bound] = useState(R.evolve({ x: R.add(32), y: R.add(32) }, getBound()));
  const handleActive = () => {
    action$.next({ type: WindowEvent.ACTIVATE, data: [exec.id] });
  };

  const handleMoved = (size: Partial<SizeType>) => {
    setBound(size);
  };

  const init = () => {
    const subscription = action$
      .pipe(
        Rx.filter((value) => value.type === WindowEvent.ACTIVATE),
        Rx.map((value) => value.data[0] /* id */)
      )
      .subscribe((value) => {
        setState(() => ({ active: value === exec.id }));
      });
    //* 마운드 되면 'active' 처리
    handleActive();

    //* 위치 정보 세션에 저장
    setBound(bound);

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <Rnd
      id={exec.id}
      className={clsx('titlebar', { active: state.active })}
      dragHandleClassName="titlebar"
      minWidth={482}
      minHeight={322}
      default={bound}
      bounds={'main'}
      onMouseDown={handleActive}
      onDragStop={(e, data) => {
        //* x,y 추출
        handleMoved(R.pick(['x', 'y'], data));
      }}
      onResizeStop={(evnet, dir, el, delta, position) => {
        //* 위치, 크기
        handleMoved({
          ...position,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }}
    >
      <section className={styles.container}>
        <Titlebar exec={exec} />
        <Viewport>{children}</Viewport>
      </section>
    </Rnd>
  );
}
