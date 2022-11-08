import "./rnd.css";
import { useEffect, useState } from 'react';
import Plugin from '~/plugins';
import { task$, ExecType } from '~/store';
import Window from './Window';
export default function Windows() {
  const [items, setItems] = useState<ExecType[]>([]);

  const init = () => {
    const subscription = task$.subscribe(setItems);

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <>
      {items.map((v: ExecType) => (
        <Window key={v.id} exec={v}>
          <Plugin exec={v} />
        </Window>
      ))}
    </>
  );
}
