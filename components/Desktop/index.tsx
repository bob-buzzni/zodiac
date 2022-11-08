import { useEffect } from 'react';
import Shortcut from './Shortcut';
import Windows from '../Windows';
export default function Taskbar() {
  const init = () => {};
  useEffect(init, []);
  return (
    <div>
      <Shortcut />
      <Windows />
    </div>
  );
}
