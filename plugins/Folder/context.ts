import { createContext } from 'react';
import * as Rx from 'rxjs';

export type HistoryType<T> = {
  action: string;
  args: T;
};

export default createContext({
  history$: new Rx.Subject<HistoryType<any>>(),
});
