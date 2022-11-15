import * as Rx from 'rxjs';
import * as R from 'ramda';
import { PluginType } from '../plugins';
export type ExecType = {
  id: string;
  cmd: 'start' | 'stop';
  app: string;
  args: any;
};

function random(): string {
  return Math.random().toString(36).substring(2);
}

class Exec extends Rx.Subject<ExecType> {
  next(args: Partial<ExecType>) {
    const initial = {
      id: random(),
    };
    super.next({ ...initial, ...args } as ExecType);
  }
}

type Actiontype = {
  type: string;
  data: any;
};

export const exec$ = new Exec();
export const task$ = new Rx.Subject<ExecType[]>();
export const action$ = new Rx.Subject<Actiontype>();
export default { exec$, task$, action$ };
