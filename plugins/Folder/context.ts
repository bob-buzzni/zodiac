import { createContext } from 'react';
import * as Rx from 'rxjs';

type BackwardType = {
  action: 'backward';
};
type ForwardType = {
  action: 'forward';
};
type PushType = {
  action: 'push';
  args: any;
};
type InitialType = {
  action: 'initial';
  args: any;
};

export type HistoryType = BackwardType | ForwardType | PushType | InitialType;

export default createContext({
  history$: new Rx.Subject<HistoryType>(),
});
