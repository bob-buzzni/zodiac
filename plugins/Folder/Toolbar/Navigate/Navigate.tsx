import styles from './Navigate.module.css';

type PropsType = {};
function Navigate({}: PropsType) {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.button}>
        <i className="fa-solid fa-arrow-left" />
      </button>
      <button type="button" className={styles.button}>
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
}

export default Navigate;
