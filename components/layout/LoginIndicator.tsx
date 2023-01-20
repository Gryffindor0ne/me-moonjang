import styles from '@styles/Indicator.module.css';

const LoginIndicator = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen pb-40">
      <div className={styles.loading}>
        <h2>LOADING</h2>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default LoginIndicator;
