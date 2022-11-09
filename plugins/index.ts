import { ExecType } from '../store';

export type PluginType = {
  icon: string;
  color: string;
  subject: string;
  description: string;
  component: (props: any) => JSX.Element;
};

type PropsType = {
  exec: ExecType;
};

const items = new Map<string, PluginType>();
export const install = (key: string, data: any) => {
  items.set(key, data);
};

export const getPlugin = (key: string) => {
  return items.get(key);
};

export default ({ exec }: PropsType): JSX.Element | null => {
  const app = getPlugin(exec.app);
  return app ? app.component({ args: exec.args }) : null;
};
