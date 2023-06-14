import { useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '@styles/styles.module.css';

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push('/auth/login'), 3000);
  }, [router]);

  return (
    <div className={styles.splash}>
      <div className="flex items-center justify-center w-full h-full  bg-teal-500">
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
