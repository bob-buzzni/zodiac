import styles from './Toolbar.module.css';
import Navigate from './Navigate';
import Crud from './Crud';

function Toolbar() {
  return (
    <aside className={styles.container}>
      <Navigate />
      <span className={styles.space} />
      <Crud />
    </aside>
  );
}
export default Toolbar;
