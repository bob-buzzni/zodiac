import styles from './Viewport.module.css';
type PropsType = {
  children: any;
};
function Viewport({ children }: PropsType) {
  return <div className={styles.container}>{children}</div>;
}

export default Viewport;
