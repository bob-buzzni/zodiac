import { createContext } from 'react';
import * as Rx from 'rxjs';

export type HistoryType = {
  type: string;
  data: { [key: string]: any };
};

export default createContext({
  history$: new Rx.Subject<HistoryType>(),
});
