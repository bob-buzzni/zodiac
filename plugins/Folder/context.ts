import { createContext } from 'react';
import * as Rx from 'rxjs';

export const HistoryEvent = {
  BACKWARD: 'history.backward',
  FORWARD: 'history.forward',
  PUSH: 'history.push',
  INITIAL: 'history.initial',
} as const;

export type HistoryType = {
  type:
    | typeof HistoryEvent.BACKWARD
    | typeof HistoryEvent.FORWARD
    | typeof HistoryEvent.PUSH
    | typeof HistoryEvent.INITIAL;
  args: { [key: string]: any };
};

export default createContext({
  history$: new Rx.Subject<HistoryType>(),
});
