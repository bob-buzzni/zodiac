'use client';

import '~/plugins/provider';
import { useEffect } from 'react';
import * as Rx from 'rxjs';
import Desktop from '~/components/Desktop';
import Taskbar from '~/components/Taskbar';
import { action$, exec$, task$ } from '~/store';
export default function Home() {
  const init = () => {
    const subscription = Rx.merge(exec$, task$, action$).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };
  useEffect(init, []);

  return (
    <>
      <header>
        <Taskbar />
      </header>
      <main>
        <Desktop />
      </main>
    </>
  );
}
