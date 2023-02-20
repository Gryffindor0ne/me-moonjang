import styles from '@styles/styles.module.css';

const Splash = ({ router }: { router: any }) => {
  setTimeout(() => router.push('/auth/login'), 3000);

  return (
    <div className={styles.splash}>
      <div className="flex items-center justify-center w-full h-full pb-40 bg-teal-500">
        <div className="tracking-in-expand-fwd">
          <div className="blur-out-expand">
            <span className="text-3xl font-bold text-white md:text-4xl">
              Me Moonjang
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
