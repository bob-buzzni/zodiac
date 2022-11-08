import styles from './Crud.module.css';
type PropsType = {};

function Crud({}: PropsType) {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.button}>
        디렉토리 생성
      </button>
      <button type="button" className={styles.button}>
        파일 생성
      </button>
      <button type="button" className={styles.button}>
        복사
      </button>
      <button type="button" className={styles.button}>
        이름 변경
      </button>
      <button type="button" className={styles.button}>
        삭제
      </button>
    </div>
  );
}

export default Crud;
